import React, { useContext, useState } from "react";
import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
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

const NuevaCategoria = ({ onCategoriaAdded }) => {
  const { actualizarTabla } = useContext(TableContext);
  const navigate = useNavigate();

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

  const handleChange = (field, value) => {
    // Convertir el valor a número si es posible
    const numericValue = parseFloat(value);
    // Verificar si el valor es un número válido antes de actualizar el estado
    if (!isNaN(numericValue)) {
      setNuevaCategoria((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    } else {
      setNuevaCategoria((prev) => ({
        ...prev,
        [field]: value, // Si no es un número válido, se guarda como string
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "categoriasEmpleado"), nuevaCategoria);
      alert("Categoría agregada correctamente");
      if (onCategoriaAdded) {
        onCategoriaAdded();
      }
      setNuevaCategoria({
        codigoSindicato: "",
        horaEstandar: 0,
        horaExtra: 0,
        horaFeriado: 0,
        horaLargaDistancia: 0,
        horaTraslado: 0,
        nombre: "",
      });
      actualizarTabla("categoriasEmpleado");
      navigate("/administracionCategorias");
    } catch (error) {
      console.error("Error agregando la categoría: ", error);
      alert("Error agregando la categoría");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ marginTop: "0rem", marginLeft: "5rem" }}>
        <h4 style={{ fontFamily: '"Kanit", sans-serif', marginLeft: "43%" }}>
          Agregar Nueva Categoría
        </h4>

        <div style={{ marginLeft: "16.5rem" }}>
          <div style={{ margin: "1rem" }}>
            <TextField
              id="codigoSindicato"
              label="Código Sindicato"
              value={nuevaCategoria.codigoSindicato}
              helperText="Código del sindicato"
              variant="standard"
              onChange={(e) => handleChange("codigoSindicato", e.target.value)}
            />
          </div>
          <div style={{ margin: "1rem" }}>
            <TextField
              id="nombre"
              label="Nombre"
              value={nuevaCategoria.nombre}
              helperText="Nombre de la categoría"
              variant="standard"
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
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
                id="horaEstandar"
                label="Hora Estándar"
                value={nuevaCategoria.horaEstandar}
                helperText="Costo de la hora estándar"
                variant="standard"
                onChange={(e) => handleChange("horaEstandar", e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id="horaExtra"
                label="Hora Extra"
                value={nuevaCategoria.horaExtra}
                helperText="Costo de la hora extra"
                variant="standard"
                onChange={(e) => handleChange("horaExtra", e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id="horaFeriado"
                label="Hora Feriado"
                value={nuevaCategoria.horaFeriado}
                helperText="Costo de la hora en días feriados"
                variant="standard"
                onChange={(e) => handleChange("horaFeriado", e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id="horaLargaDistancia"
                label="Hora Larga Distancia"
                value={nuevaCategoria.horaLargaDistancia}
                helperText="Costo de la hora para largas distancias"
                variant="standard"
                onChange={(e) =>
                  handleChange("horaLargaDistancia", e.target.value)
                }
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </div>
            <div style={{ margin: "1rem" }}>
              <TextField
                id="horaTraslado"
                label="Hora Traslado"
                value={nuevaCategoria.horaTraslado}
                helperText="Costo de la hora de traslado"
                variant="standard"
                onChange={(e) => handleChange("horaTraslado", e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </div>
          </div>
        </div>
        <Button
          style={{
            fontFamily: '"Kanit", sans-serif',
            marginLeft: "44%",
            margin: "5rem",
          }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Agregar Categoría
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default NuevaCategoria;
