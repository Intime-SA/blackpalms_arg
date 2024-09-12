import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { db, uploadFile } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const EditFormCliente = () => {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      const docRef = doc(db, "clientes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCliente(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchClientData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "telefono" || name === "datosFiscales.cuit") &&
      (!/^\d*$/.test(value) || value.length > 12)
    ) {
      return;
    }

    if (name.startsWith("datosFiscales")) {
      const nestedName = name.split(".")[1];
      setCliente((prevCliente) => ({
        ...prevCliente,
        datosFiscales: {
          ...prevCliente.datosFiscales,
          [nestedName]: value,
        },
      }));
    } else {
      setCliente((prevCliente) => ({
        ...prevCliente,
        [name]: value,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["nombre", "email", "telefono"];
    const requiredFiscalFields = [
      "cuit",
      "direccion",
      "numero",
      "ciudad",
      "provincia",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!cliente[field]) {
        newErrors[field] = `El ${field} es requerido.`;
      }
    });

    requiredFiscalFields.forEach((field) => {
      if (!cliente.datosFiscales[field]) {
        newErrors[`datosFiscales.${field}`] = `El ${field} es requerido.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const obj = {
      ...cliente,
      fechaActualizacion: serverTimestamp(),
    };
    const docRef = doc(db, "clientes", id);
    await updateDoc(docRef, obj);
    navigate("/clientes");
    window.location.reload();
  };

  const handleReturn = () => {
    setOpenForm(false);
  };

  const handleImage = async () => {
    setIsLoading(true);
    try {
      const url = await uploadFile(file);
      setCliente((prevState) => ({
        ...prevState,
        imagen: url,
      }));
      setIsImageUploaded(true);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cliente) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ width: "80%", zoom: "0.9", marginLeft: "16.5rem" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              width: "100%",
            }}
          >
            <h5
              style={{
                margin: "1rem",
                marginBottom: "2rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Datos de Cliente
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="nombre"
                variant="outlined"
                label={`Nombre: ${cliente.nombre}`}
                value={cliente.nombre}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />

              <TextField
                name="email"
                variant="outlined"
                label={`Correo electrónico: ${cliente.email}`}
                value={cliente.email}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                name="telefono"
                variant="outlined"
                label={`Teléfono: ${cliente.telefono}`}
                value={cliente.telefono}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />
              <TextField
                name="datosFiscales.cuit"
                variant="outlined"
                label={`CUIT: ${cliente.datosFiscales.cuit}`}
                value={cliente.datosFiscales.cuit}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors["datosFiscales.cuit"]}
                helperText={errors["datosFiscales.cuit"]}
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
            }}
          >
            <h5
              style={{
                marginTop: "0rem",
                marginBottom: "2rem",
                marginLeft: "1rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Datos Fiscales
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="datosFiscales.direccion"
                variant="outlined"
                label={`Dirección: ${cliente.datosFiscales.direccion}`}
                value={cliente.datosFiscales.direccion}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  maxWidth: "400px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors["datosFiscales.direccion"]}
                helperText={errors["datosFiscales.direccion"]}
              />
              <TextField
                name="datosFiscales.numero"
                variant="outlined"
                label={`Número: ${cliente.datosFiscales.numero}`}
                value={cliente.datosFiscales.numero}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors["datosFiscales.numero"]}
                helperText={errors["datosFiscales.numero"]}
              />
              <TextField
                name="datosFiscales.pisoDpto"
                variant="outlined"
                label={`Piso/Dpto: ${cliente.datosFiscales.pisoDpto}`}
                value={cliente.datosFiscales.pisoDpto}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors["datosFiscales.pisoDpto"]}
                helperText={errors["datosFiscales.pisoDpto"]}
              />
              <TextField
                name="datosFiscales.ciudad"
                variant="outlined"
                label={`Ciudad: ${cliente.datosFiscales.ciudad}`}
                value={cliente.datosFiscales.ciudad}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors["datosFiscales.ciudad"]}
                helperText={errors["datosFiscales.ciudad"]}
              />
              <TextField
                name="datosFiscales.provincia"
                variant="outlined"
                label={`Provincia: ${cliente.datosFiscales.provincia}`}
                value={cliente.datosFiscales.provincia}
                onChange={handleChange}
                fullWidth
                style={{
                  marginBottom: "1rem",
                  width: "50%",
                  maxWidth: "200px",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  style: {
                    fontFamily: '"Kanit", sans-serif',
                  },
                }}
                error={!!errors["datosFiscales.provincia"]}
                helperText={errors["datosFiscales.provincia"]}
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "0.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              width: "100%",
              height: "fit-content",
            }}
          >
            <h5
              style={{
                margin: "1rem",
                marginBottom: "2rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Imagen del Cliente
            </h5>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
                marginBottom: "1rem",
              }}
            >
              {!file && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  <label htmlFor="fileInput" style={{ marginRight: "8px" }}>
                    <Button
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="contained"
                      component="span"
                    >
                      Subir Imagen
                    </Button>
                  </label>
                </div>
              )}

              {file && !isImageUploaded && (
                <Button
                  variant="contained"
                  onClick={handleImage}
                  disabled={isLoading}
                  color="error"
                  style={{
                    marginTop: "1rem",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  {isLoading ? "Subiendo imagen..." : "Confirmar subida"}
                </Button>
              )}

              {isLoading && <p>Subiendo imagen...</p>}
              {isImageUploaded && <p>¡Imagen subida con éxito!</p>}

              {cliente && cliente.imagen && (
                <img
                  src={cliente.imagen}
                  alt="Imagen del cliente"
                  style={{
                    marginTop: "1rem",
                    maxWidth: "50%",
                    height: "auto",
                    borderRadius: "5%",
                  }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
              gap: "1rem",
            }}
          >
            <Button
              style={{ fontFamily: '"Kanit", sans-serif' }}
              variant="outlined"
              onClick={handleReturn}
            >
              Volver
            </Button>
            <Button
              style={{ fontFamily: '"Kanit", sans-serif' }}
              variant="contained"
              type="submit"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFormCliente;
