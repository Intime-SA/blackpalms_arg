import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@mui/material";

const AgregarCuenta = () => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [cbu, setCbu] = useState("");
  const navigate = useNavigate();

  const handleAddCuenta = async (e) => {
    e.preventDefault();
    try {
      const nuevaCuenta = {
        nombre,
        tipo,
        cbu,
      };

      await addDoc(collection(db, "cuentas"), nuevaCuenta);

      // Limpiar los campos después de agregar la cuenta
      setNombre("");
      setTipo("");
      setCbu("");

      console.log("Cuenta agregada correctamente");
      navigate("/"); // Redirigir a la lista de cuentas
    } catch (error) {
      console.error("Error al agregar la cuenta:", error);
    }
  };

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontFamily: '"Kanit", sans-serif' }}
      >
        Agregar Nueva Cuenta
      </Typography>
      <form onSubmit={handleAddCuenta}>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="normal"
        />
        <Autocomplete
          options={["caja", "bancaria"]}
          getOptionLabel={(option) => option}
          onChange={(event, value) => setTipo(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          )}
        />
        <TextField
          label="CBU"
          variant="outlined"
          fullWidth
          value={cbu}
          onChange={(e) => setCbu(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Agregar Cuenta
        </Button>
      </form>
    </div>
  );
};

export default AgregarCuenta;
