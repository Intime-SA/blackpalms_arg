import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { v4 } from "uuid";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const SubConceptosForm = ({ setOpenForm }) => {
  const [conceptos, setConceptos] = useState([]);
  const [newConcepto, setNewConcepto] = useState({
    nombre: "",
    id: "",
    descripcion: "",
    subconceptos: {},
  });
  const [errors, setErrors] = useState({});

  const fetchConceptos = async () => {
    try {
      const collectionRef = collection(db, "conceptos");
      const snapShot = await getDocs(collectionRef);
      return snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching concepts: ", error);
      throw error;
    }
  };

  const addConcepto = async (newConcepto, idConcepto) => {
    try {
      const docRef = doc(db, "conceptos", idConcepto);
      await setDoc(docRef, newConcepto);
      window.location.reload();
    } catch (error) {
      console.error("Error adding concept: ", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConcepto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre } = newConcepto;
    const validationErrors = {};
    if (!nombre) validationErrors.nombre = "Nombre es requerido";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const idConcepto = v4();

    const newConceptoData = {
      ...newConcepto,
      id: idConcepto,
    };

    try {
      await addConcepto(newConceptoData, idConcepto);
      setOpenForm(false);
      setNewConcepto({
        nombre: "",
        id: "",
        descripcion: "",
        subconceptos: {
          nombre: "",
          descripcion: "",
        },
      });
    } catch (error) {
      console.error("Error adding concept: ", error);
    }
  };
  const handleReturn = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const loadConceptos = async () => {
      try {
        const conceptosList = await fetchConceptos();
        setConceptos(conceptosList);
      } catch (error) {
        console.error("Error fetching concepts: ", error);
      }
    };

    loadConceptos();
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
                marginBottom: "2rem",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Nuevo Concepto
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="nombre"
                variant="outlined"
                label="Nombre"
                value={newConcepto.nombre}
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
                value={newConcepto.descripcion}
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
            Cargar Concepto
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

export default SubConceptosForm;
