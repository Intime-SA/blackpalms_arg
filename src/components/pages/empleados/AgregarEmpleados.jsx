import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, uploadFile } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";

const AgregarEmpleado = () => {
  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");
  const [imagen, setImagen] = useState("");
  const [obrasActivas, setObrasActivas] = useState([]);
  const [telefono, setTelefono] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};

    if (!apellido.trim()) {
      errors.apellido = "El apellido es requerido";
    }
    if (!nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }
    if (!fechaAlta) {
      errors.fechaAlta = "La fecha de alta es requerida";
    }
    if (!telefono.trim()) {
      errors.telefono = "El teléfono es requerido";
    }

    return errors;
  };

  const navigate = useNavigate();

  const handleAddEmpleado = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const nuevoEmpleado = {
          apellido,
          nombre,
          fechaAlta: new Date(fechaAlta),
          telefono,
        };

        await addDoc(collection(db, "empleados"), nuevoEmpleado);

        // Limpiar los campos después de agregar el empleado
        setApellido("");
        setNombre("");
        setFechaAlta("");
        setImagen("");
        setTelefono("");

        console.log("Empleado agregado correctamente");
        navigate("/"); // Redirigir a la lista de empleados
      } catch (error) {
        console.error("Error al agregar el empleado:", error);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontFamily: '"Kanit", sans-serif' }}
      >
        Agregar Nuevo Empleado
      </Typography>
      <form onSubmit={handleAddEmpleado}>
        <TextField
          label="Apellido"
          variant="outlined"
          fullWidth
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          margin="normal"
          error={!!errors.apellido}
          helperText={errors.apellido}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="normal"
          error={!!errors.nombre}
          helperText={errors.nombre}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <TextField
          label="Fecha de Alta"
          variant="outlined"
          type="datetime-local"
          fullWidth
          value={fechaAlta}
          onChange={(e) => setFechaAlta(e.target.value)}
          margin="normal"
          error={!!errors.fechaAlta}
          helperText={errors.fechaAlta}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />

        <TextField
          label="Teléfono"
          variant="outlined"
          fullWidth
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          margin="normal"
          error={!!errors.telefono}
          helperText={errors.telefono}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Esto distribuirá los elementos a lo largo del contenedor
            marginTop: "1rem",
          }}
        >
          <Button
            style={{ fontFamily: '"Kanit", sans-serif' }}
            type="submit"
            variant="contained"
            color="success"
          >
            Agregar Empleado
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgregarEmpleado;
