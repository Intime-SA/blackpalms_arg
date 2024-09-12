import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { InputBase } from "@mui/material";
import { TableContext } from "../../../context/TableContext";

export default function AutoCompleteObras({
  setObrasId,
  cliente,
  changeState,
  setChangeState,
}) {
  const [selectedObras, setSelectedObras] = React.useState([]);
  const { obras, clientes } = React.useContext(TableContext);

  const handleSelectionChange = (event, values) => {
    setSelectedObras(values);
    const selectedIds = values.map((obra) => obra.id);
    setObrasId(selectedIds);
    console.log(selectedIds);
    setChangeState(!changeState);
  };

  const renderClienteNombre = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "N/A";
  };

  const obrasEnProceso = obras.filter(
    (obra) => obra.estado === "enProceso" && obra.cliente === cliente
  );

  React.useEffect(() => {
    setSelectedObras([]); // Limpiar el estado de selectedObras cuando cambia el cliente
    setObrasId([]); // Limpiar el estado de obrasId cuando cambia el cliente
  }, [cliente, setObrasId]);

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={obrasEnProceso}
        getOptionLabel={(option) =>
          option.descripcion + " / " + renderClienteNombre(option.cliente)
        }
        filterSelectedOptions
        value={selectedObras}
        onChange={handleSelectionChange}
        sx={{ backgroundColor: "transparent" }}
        renderInput={(params) => (
          <InputBase
            {...params.InputProps}
            inputProps={{ ...params.inputProps }}
            sx={{
              backgroundColor: "white",
              borderRadius: "50px",
              border: "0px",
              padding: "10px",
              width: "100%",
              boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
            }}
            placeholder={selectedObras.length > 0 ? "" : " Selecciona obras"}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              style: {
                fontFamily: '"Kanit", sans-serif',
              },
            }}
          />
        )}
      />
    </Stack>
  );
}
