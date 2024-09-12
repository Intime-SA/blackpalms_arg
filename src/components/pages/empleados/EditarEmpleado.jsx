import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Autocomplete } from "@mui/material";
import { TableContext } from "../../context/TableContext";

const EditarEmpleado = () => {
  const { id } = useParams(); // Capturamos el ID del empleado desde la URL
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null); // Estado para almacenar datos del empleado
  const [apellido, setApellido] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaAlta, setFechaAlta] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoriaEmpleado, setCategoriaEmpleado] = useState("");
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);

  const { actualizarTabla } = useContext(TableContext); // Asegúrate de que TableContext proporciona empleados

  const handleUpdate = async () => {
    await actualizarTabla("empleados");
  };

  // Función para obtener los datos del empleado por su ID
  const fetchEmpleado = async () => {
    try {
      const docSnap = await getDoc(doc(db, "empleados", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmpleado(data); // Guardamos los datos del empleado en el estado
        setApellido(data.apellido); // Mostramos el apellido actual en el campo
        setNombre(data.nombre); // Mostramos el nombre actual en el campo
        setFechaAlta(data.fechaAlta.toDate().toISOString().slice(0, -1)); // Mostramos la fecha de alta actual en el campo (ajustada al formato del input)
        setTelefono(data.telefono); // Mostramos el teléfono actual en el campo
        setCategoriaEmpleado(data.categoriaEmpleado || "No asignado");
      } else {
        console.error("No existe el empleado con el ID proporcionado");
      }
    } catch (error) {
      console.error("Error al obtener el empleado:", error);
    }

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "categoriasEmpleado")
        );
        const categoriasData = [];
        querySnapshot.forEach((doc) => {
          categoriasData.push({ id: doc.id, ...doc.data() });
        });
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  };

  // Efecto para cargar los datos del empleado al cargar el componente
  useEffect(() => {
    fetchEmpleado(); // Llamamos a la función para cargar los datos del empleado
  }, []);

  // Función para validar los campos
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

  // Función para manejar la actualización del empleado
  const handleUpdateEmpleado = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const empleadoActualizado = {
          apellido,
          nombre,
          fechaAlta: new Date(fechaAlta),
          telefono,
          categoriaEmpleado,
        };

        await updateDoc(doc(db, "empleados", id), empleadoActualizado);

        console.log("Empleado actualizado correctamente");
        handleUpdate();
        navigate("/empleados");
      } catch (error) {
        console.error("Error al actualizar el empleado:", error);
      }
    } else {
      setErrors(errors);
    }
  };

  if (!empleado) {
    return <Typography variant="h6">Cargando empleado...</Typography>;
  }

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontFamily: '"Kanit", sans-serif' }}
      >
        Editar Empleado
      </Typography>
      <form onSubmit={handleUpdateEmpleado}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(categoria) => categoria.nombre}
          options={categorias}
          value={categoriaEmpleado}
          sx={{ width: 300 }}
          onChange={(e, value) => setCategoriaEmpleado(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cargo"
              error={!!errors.categoriaEmpleado}
              helperText={errors.categoriaEmpleado}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                ...params.InputProps,
                style: {
                  fontFamily: '"Kanit", sans-serif',
                },
              }}
            />
          )}
        />
        <br />
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
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            style={{ fontFamily: '"Kanit", sans-serif' }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Actualizar Empleado
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarEmpleado;
