import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Autocomplete, TextField } from "@mui/material";
import { TableContext } from "../../../context/TableContext";

export default function AutoCompleteCliente({
  setCliente,
  cliente,
  changeState,
  setChangeState,
}) {
  const { clientes } = React.useContext(TableContext);
  const handleChange = (event, newValue) => {
    setCliente(newValue ? newValue.id : "");
    setChangeState(!changeState); // Guardar solo el ID del Cliente seleccionado
  };

  return (
    <Box sx={{ minWidth: 120, margin: "1rem" }}>
      <FormControl fullWidth>
        <Autocomplete
          id="Cliente-autocomplete"
          options={clientes}
          getOptionLabel={(option) => option.nombre}
          value={clientes.find((option) => option.id === cliente)} // Obtener el objeto Cliente por ID
          onChange={handleChange} // Manejar cambios de selección
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Cliente"
              variant="standard"
            />
          )}
        />
      </FormControl>
    </Box>
  );
}
