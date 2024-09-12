import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  ThemeProvider,
  createTheme,
  Divider,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: '"Kanit", sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& input": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& .MuiInputBase-root": {
            fontFamily: '"Kanit", sans-serif',
          },
          "& .MuiFormHelperText-root": {
            fontFamily: '"Kanit", sans-serif',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Kanit", sans-serif',
        },
      },
    },
  },
});

const FormularioCategoria = ({ categoriaId }) => {
  const [nuevaCategoria, setNuevaCategoria] = useState({
    codigoSindicato: "",
    horaEstandar: 0,
    horaExtra: 0,
    horaFeriado: 0,
    horaLargaDistancia: 0,
    horaTraslado: 0,
    horaVenta: 0,
    horaVentaDistancia: 0,
    nombre: "",
  });

  const { actualizarTabla } = useContext(TableContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "categoriasEmpleado", categoriaId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setNuevaCategoria({
            codigoSindicato: data.codigoSindicato || "",
            horaEstandar: data.horaEstandar || 0,
            horaExtra: data.horaExtra || 0,
            horaFeriado: data.horaFeriado || 0,
            horaLargaDistancia: data.horaLargaDistancia || 0,
            horaTraslado: data.horaTraslado || 0,
            horaVenta: data.horaVenta || 0,
            horaVentaDistancia: data.horaVentaDistancia || 0,
            nombre: data.nombre || "",
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching categoriasEmpleado: ", error);
      }
    };

    fetchData();
  }, [categoriaId]);

  const formatCurrency = (value) => {
    const stringValue = String(value);
    return parseFloat(stringValue).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const handleChange = (field, value) => {
    setNuevaCategoria((prevCategoria) => ({
      ...prevCategoria,
      [field]: parseFloat(value), // Convertir a número
    }));
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[$.,]/g, "");
  };

  const navigate = useNavigate();

  const actualizarEmpleados = async (categoriaId) => {
    console.log(categoriaId);
    try {
      const empleadosRef = collection(db, "empleados");
      const querySnapshot = await getDocs(empleadosRef);

      const empleados = [];
      querySnapshot.forEach((doc) => {
        const empleado = {
          ...doc.data(),
          id: doc.id,
        };
        console.log(empleado);
        // Filtras y actualizas los empleados que cumplan con la condición
        if (empleado.categoriaEmpleado.id === categoriaId) {
          empleados.push({
            ref: doc.ref,
            data: {
              ...empleado,
              categoriaEmpleado: {
                ...nuevaCategoria,
                id: categoriaId, // Agregar categoriaId dentro de categoriaEmpleado
              },
            },
          });
        }
      });

      console.log(empleados);

      const promises = empleados.map(async (empleado) => {
        try {
          const { ref, data } = empleado;
          await updateDoc(ref, data);
          console.log(`Empleado con ID ${ref.id} actualizado`);
        } catch (error) {
          console.error(
            `Error actualizando empleado con ID ${empleado.ref.id}: `,
            error
          );
        }
      });

      await Promise.all(promises);
      console.log("Todos los empleados actualizados correctamente");
    } catch (error) {
      console.error("Error obteniendo o actualizando empleados: ", error);
    }
  };
  const handleSubmit = async () => {
    try {
      const docRef = doc(db, "categoriasEmpleado", categoriaId);
      await updateDoc(docRef, nuevaCategoria);
      alert("Datos actualizados correctamente");
      await actualizarEmpleados(categoriaId);
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando los datos: ", error);
      alert("Error actualizando los datos");
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{ marginTop: "0rem", marginLeft: "5rem", marginBottom: "5rem" }}
      >
        <h4 style={{ fontFamily: '"Kanit", sans-serif', marginLeft: "42%" }}>
          Editar Valores de {nuevaCategoria.nombre}
        </h4>
        <div style={{ display: "flex", justifyContent: "flex-start  " }}>
          <div>
            <h5
              style={{
                fontFamily: '"Kanit", sans-serif',
                marginTop: "5rem",
                textAlign: "center",
              }}
            >
              Hora Costo
            </h5>
            <div style={{ margin: "1rem" }}>
              <TextField
                label={formatCurrency(nuevaCategoria.horaEstandar || 0)}
                helperText="Costo de la hora estándar"
                variant="standard"
                onChange={(e) => handleChange("horaEstandar", e.target.value)}
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaExtra`}
                label={formatCurrency(nuevaCategoria.horaExtra || 0)}
                helperText="Costo de la hora extra"
                variant="standard"
                onChange={(e) => ("horaExtra", e.target.value)}
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaFeriado`}
                label={formatCurrency(nuevaCategoria.horaFeriado || 0)}
                helperText="Costo de la hora en días feriados"
                variant="standard"
                onChange={(e) => handleChange("horaFeriado", e.target.value)}
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaLargaDistancia`}
                label={formatCurrency(nuevaCategoria.horaLargaDistancia || 0)}
                helperText="Costo de la hora para largas distancias"
                variant="standard"
                onChange={(e) =>
                  handleChange("horaLargaDistancia", e.target.value)
                }
                onInput={handleInput}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id={`horaTraslado`}
                label={formatCurrency(nuevaCategoria.horaTraslado || 0)}
                helperText="Costo de la hora de traslado"
                variant="standard"
                onChange={(e) => handleChange("horaTraslado", e.target.value)}
                onInput={handleInput}
              />
            </div>
          </div>
        </div>

        <Button
          style={{
            fontFamily: '"Kanit", sans-serif',
            margin: "5rem",
            marginLeft: "43.5%",
          }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Guardar Cambios
        </Button>
      </div>
      <Divider />
    </ThemeProvider>
  );
};

export default FormularioCategoria;
