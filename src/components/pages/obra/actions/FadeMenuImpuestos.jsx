import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { TextField } from "@mui/material";

export default function FadeMenuImpuestos({
  impuesto,
  setImpuesto,
  limpiarYConvertir,
  formatNumber,
}) {
  const [tipoImpuesto, setTipoImpuesto] = React.useState("");
  const [impuestoMonto, setImpuestoMonto] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImpuestos = (value) => {
    setTipoImpuesto(value);
    handleClose();
  };

  const handleMontoChangeImpuesto = (value) => {
    // Formatea el valor mientras escribes para que tenga el formato deseado
    const formattedValue = formatNumber(value);
    setImpuestoMonto(formattedValue);
  };

  const handleAddImpuesto = () => {
    // Limpia y convierte el valor formateado
    const cleanedValue = limpiarYConvertir(impuestoMonto);

    // Crea el nuevo objeto de impuesto
    const newImpuesto = {
      tipoImpuesto,
      monto: cleanedValue,
    };

    // Usa push para agregar el nuevo objeto al array
    setImpuesto((prevImpuestos) => {
      const updatedImpuestos = Array.isArray(prevImpuestos)
        ? [...prevImpuestos]
        : [];
      updatedImpuestos.push(newImpuesto);
      return updatedImpuestos;
    });

    // Limpiar los campos de entrada
    setTipoImpuesto("");
    setImpuestoMonto("");
  };

  return (
    <div>
      <div>
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{ marginTop: "1rem", fontFamily: '"Kanit", sans-serif' }}
        >
          {tipoImpuesto ? (
            tipoImpuesto
          ) : (
            <>
              <span className="material-symbols-outlined">arrow_drop_down</span>
            </>
          )}
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("ticket")}
          >
            Ticket (exento)
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("IVA27")}
          >
            IVA 27,00%
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("IVA21")}
          >
            IVA 21,00%
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("IVA10")}
          >
            IVA 10,50%
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("IVA2")}
          >
            IVA 02,50%
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("IIBB")}
          >
            IIBB
          </MenuItem>
          <MenuItem
            style={{ fontFamily: '"Kanit", sans-serif' }}
            onClick={() => handleImpuestos("PERCEPCION")}
          >
            Percepción
          </MenuItem>
        </Menu>
        <TextField
          id="impuesto"
          variant="standard"
          value={impuestoMonto}
          onChange={(e) => handleMontoChangeImpuesto(e.target.value)}
          style={{ fontFamily: '"Kanit", sans-serif', marginTop: "1rem" }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleAddImpuesto}
          style={{ fontFamily: '"Kanit", sans-serif', marginTop: "1rem" }}
        >
          <span className="material-symbols-outlined">add_circle</span>
        </Button>
      </div>
    </div>
  );
}
