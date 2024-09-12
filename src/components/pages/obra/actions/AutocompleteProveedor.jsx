import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Autocomplete, TextField } from "@mui/material";

export default function AutoCompleteProveedor({ setProveedor, proveedor }) {
  const [array, setArray] = React.useState([]);

  React.useEffect(() => {
    const consultaProveedor = async () => {
      try {
        const collectionProveedor = collection(db, "proveedores");
        const proveedorSnapshot = await getDocs(collectionProveedor);
        const proveedorData = proveedorSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Actualizar el estado con los proveedores filtrados
        setArray(proveedorData);
      } catch (error) {
        console.error("Error fetching Proveedores:", error);
      }
    };

    consultaProveedor();
  }, []);

  console.log(array);

  const handleChange = (event, newValue) => {
    setProveedor(newValue ? newValue.id : ""); // Guardar solo el ID del proveedor seleccionado
  };

  return (
    <Box sx={{ minWidth: 120, marginTop: "1rem" }}>
      <FormControl fullWidth>
        <Autocomplete
          id="proveedor-autocomplete"
          options={array}
          getOptionLabel={(option) => option.nombreComercio}
          value={array.find((option) => option.id === proveedor)} // Obtener el objeto proveedor por ID
          onChange={handleChange} // Manejar cambios de selección
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Proveedor"
              variant="standard"
            />
          )}
        />
      </FormControl>
    </Box>
  );
}
