import React, { useEffect, useState } from "react";
import { TextField, Button, ThemeProvider, createTheme } from "@mui/material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

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

const AdministracionAjustes = () => {
  const [ajustes, setAjustes] = useState([]);
  const [nuevosAjustes, setNuevosAjustes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "ajustes"));
      const ajustesData = [];
      querySnapshot.forEach((doc) => {
        ajustesData.push({ id: doc.id, ...doc.data() });
      });
      setAjustes(ajustesData);
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    const stringValue = String(value);
    return parseFloat(stringValue).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  const handleChange = (index, field, value) => {
    const updatedAjustes = { ...nuevosAjustes };
    if (!updatedAjustes[index]) {
      updatedAjustes[index] = {};
    }
    const numericValue = Number(value.replace(/[$%,.]/g, ""));
    updatedAjustes[index][field] = numericValue;
    setNuevosAjustes(updatedAjustes);
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[$.,]/g, "");
  };

  const handleSubmit = async () => {
    try {
      for (const index in nuevosAjustes) {
        const ajuste = nuevosAjustes[index];
        const docRef = doc(db, "ajustes", ajustes[index].id);
        await updateDoc(docRef, ajuste);
      }
      alert("Datos actualizados correctamente");
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando los datos: ", error);
      alert("Error actualizando los datos");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ marginTop: "0rem", marginLeft: "5rem" }}>
        <h4 style={{ fontFamily: '"Kanit", sans-serif', marginLeft: "44%" }}>
          Administración de Ajustes
        </h4>
        {ajustes.map((ajuste, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <h5
                style={{
                  fontFamily: '"Kanit", sans-serif',
                  marginTop: "5rem",
                  textAlign: "center",
                }}
              >
                Hora Venta
              </h5>
              <div style={{ margin: "1rem" }}>
                <TextField
                  id={`horaVenta_${index}`}
                  label="Hora Venta"
                  defaultValue={formatCurrency(ajuste.horaVenta || 0)}
                  helperText="Costo de la hora Venta"
                  variant="standard"
                  onChange={(e) =>
                    handleChange(index, "horaVenta", e.target.value)
                  }
                  onInput={handleInput}
                />
              </div>
              <div style={{ margin: "1rem" }}>
                <TextField
                  id={`horaVentaDistancia_${index}`}
                  label="Hora Venta Distancia"
                  defaultValue={formatCurrency(ajuste.horaVentaDistancia || 0)}
                  helperText="Costo de la hora Venta Distancia"
                  variant="standard"
                  onChange={(e) =>
                    handleChange(index, "horaVentaDistancia", e.target.value)
                  }
                  onInput={handleInput}
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          style={{ fontFamily: '"Kanit", sans-serif', marginLeft: "45%" }}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Guardar Cambios
        </Button>
      </div>
    </ThemeProvider>
  );
};

export default AdministracionAjustes;
