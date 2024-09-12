import React, { useEffect, useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { db } from "../../../firebaseConfig";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { v4 } from "uuid";

const ConceptosForm = ({ setOpenForm }) => {
  const [conceptos, setConceptos] = useState([]);
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState(null);
  const [newSubConcepto, setNewSubConcepto] = useState({
    nombre: "",
    id: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubConcepto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!conceptoSeleccionado || !newSubConcepto.nombre) {
      setErrors({
        ...errors,
        concepto: !conceptoSeleccionado ? "Seleccione un concepto" : "",
        nombre: !newSubConcepto.nombre ? "Nombre es requerido" : "",
      });
      return;
    }

    const idSubConcepto = v4();

    const updatedSubconceptos = {
      ...conceptoSeleccionado.subconceptos,
      [idSubConcepto]: {
        nombre: newSubConcepto.nombre,
        id: idSubConcepto,
        descripcion: newSubConcepto.descripcion,
      },
    };

    const conceptoRef = doc(db, "conceptos", conceptoSeleccionado.id);

    await updateDoc(conceptoRef, {
      subconceptos: updatedSubconceptos,
      updated_at: serverTimestamp(),
    });

    setOpenForm(false);
    setNewSubConcepto({
      nombre: "",
      id: "",
      descripcion: "",
    });
  };

  const handleReturn = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const fetchConceptos = async () => {
      try {
        const collectionRef = collection(db, "conceptos");
        const snapShot = await getDocs(collectionRef);
        const conceptosList = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConceptos(conceptosList);
      } catch (error) {
        console.error("Error fetching conceptos: ", error);
      }
    };

    fetchConceptos();
  }, []);

  return (
    <div style={{ width: "100%", zoom: "0.9" }}>
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
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Nuevo Sub-Concepto
            </h5>
            <div
              style={{
                margin: "1rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              <Autocomplete
                name="concepto"
                disablePortal
                id="combo-box-demo"
                options={conceptos}
                getOptionLabel={(option) => option.nombre}
                sx={{ width: 300 }}
                value={conceptoSeleccionado}
                onChange={(event, newValue) =>
                  setConceptoSeleccionado(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Concepto"
                    error={!!errors.concepto}
                    helperText={errors.concepto}
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
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="nombre"
                variant="outlined"
                label="Nombre"
                value={newSubConcepto.nombre}
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
                name="descripcion"
                variant="outlined"
                label="Descripcion"
                value={newSubConcepto.descripcion}
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
                error={!!errors.descripcion}
                helperText={errors.descripcion}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              marginBottom: "1rem",
              width: "50%",
              maxWidth: "200px",
              fontFamily: '"Kanit", sans-serif',
            }}
          >
            Cargar Sub-Concepto
          </Button>
        </form>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: '"Kanit", sans-serif',
        }}
      >
        <Button
          style={{ fontFamily: '"Kanit", sans-serif' }}
          variant="contained"
          onClick={handleReturn}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};

export default ConceptosForm;
