import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { v4 } from "uuid";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const SubCategoriasForm = ({ setOpenForm }) => {
  const [categorias, setCategorias] = useState([]);
  const [newCategory, setNewCategory] = useState({
    nombre: "",
    id: "",
    descripcion: "",
    subcategorias: [],
  });
  const [errors, setErrors] = useState({});

  const fetchCategorias = async () => {
    try {
      const collectionRef = collection(db, "categorias");
      const snapShot = await getDocs(collectionRef);
      return snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching categories: ", error);
      throw error;
    }
  };

  const addCategoria = async (newCategoria, idCategoria) => {
    try {
      const docRef = doc(db, "categorias", idCategoria);
      await setDoc(docRef, newCategoria);
      window.location.reload();
    } catch (error) {
      console.error("Error adding category: ", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre } = newCategory;
    const validationErrors = {};
    if (!nombre) validationErrors.nombre = "Nombre es requerido";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const idCategoria = v4();

    const newCategoria = {
      ...newCategory,
      id: idCategoria,
    };

    try {
      await addCategoria(newCategoria, idCategoria);
      setOpenForm(false);
      setNewCategory({
        nombre: "",
        id: "",
        descripcion: "",
      });
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };
  const handleReturn = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasList = await fetchCategorias();
        setCategorias(categoriasList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    loadCategorias();
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
              Nueva Categoria
            </h5>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <TextField
                name="nombre"
                variant="outlined"
                label="Nombre"
                value={newCategory.nombre}
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
                value={newCategory.descripcion}
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
              fontFamily: '"Kanit", sans-serif',
              marginBottom: "1rem",
              width: "50%",
              maxWidth: "200px",
            }}
          >
            Cargar Categoria
          </Button>
        </form>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
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

export default SubCategoriasForm;
