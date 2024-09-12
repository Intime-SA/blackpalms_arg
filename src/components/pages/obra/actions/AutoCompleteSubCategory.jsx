import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function AutoCompleteSubCategory({
  setSubCategoria,
  subCategoria,
  categoria,
}) {
  const [subCategorias, setSubCategorias] = useState([]);

  useEffect(() => {
    const consultaSubCategorias = async () => {
      console.log(categoria);
      try {
        const categoryDoc = doc(db, "categorias", categoria);
        const categorySnapshot = await getDoc(categoryDoc);
        const categoryData = categorySnapshot.data();
        console.log(categoryData);
        if (categoryData && categoryData.subcategorias) {
          setSubCategorias(categoryData.subcategorias);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    consultaSubCategorias();
  }, [categoria]);

  console.log(subCategorias);

  const handleChange = (event) => {
    setSubCategoria(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, margin: "1rem" }}>
      <FormControl fullWidth>
        <InputLabel
          style={{ fontFamily: '"Kanit", sans-serif' }}
          id="demo-simple-select-label"
        >
          Seleccionar Sub-Categoria
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={subCategoria}
          label="Seleccionar Sub-Categoria"
          onChange={handleChange}
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          {Object.values(subCategorias).map((subCategoria) => (
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              key={subCategoria.id}
              value={subCategoria.id}
            >
              {subCategoria.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
