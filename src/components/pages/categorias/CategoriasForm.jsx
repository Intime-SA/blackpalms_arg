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

const CategoriasForm = ({ setOpenForm }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [newSubCategory, setNewSubCategory] = useState({
    nombre: "",
    id: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSubCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoriaSeleccionada || !newSubCategory.nombre) {
      setErrors({
        ...errors,
        categoria: !categoriaSeleccionada ? "Seleccione una categoría" : "",
        nombre: !newSubCategory.nombre ? "Nombre es requerido" : "",
      });
      return;
    }

    const idSubCategoria = v4();

    const updatedSubcategorias = {
      ...categoriaSeleccionada.subcategorias,
      [idSubCategoria]: {
        nombre: newSubCategory.nombre,
        id: idSubCategoria,
        descripcion: newSubCategory.descripcion,
      },
    };

    const categoryRef = doc(db, "categorias", categoriaSeleccionada.id);

    await updateDoc(categoryRef, {
      subcategorias: updatedSubcategorias,
      updated_at: serverTimestamp(),
    });

    setOpenForm(false);
    setNewSubCategory({
      nombre: "",
      id: "",
      descripcion: "",
    });
  };

  const handleReturn = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const collectionRef = collection(db, "categorias");
        const snapShot = await getDocs(collectionRef);
        const categoriasList = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategorias(categoriasList);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategorias();
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
              Nueva Sub-Categoria
            </h5>
            <div>
              <Autocomplete
                name="categoria"
                disablePortal
                id="combo-box-demo"
                options={categorias}
                getOptionLabel={(option) => option.nombre}
                sx={{
                  width: 300,
                  margin: "1rem",
                  fontFamily: '"Kanit", sans-serif',
                }}
                value={categoriaSeleccionada}
                onChange={(event, newValue) =>
                  setCategoriaSeleccionada(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoria"
                    error={!!errors.categoria}
                    helperText={errors.categoria}
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
                value={newSubCategory.nombre}
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
                value={newSubCategory.descripcion}
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

export default CategoriasForm;
