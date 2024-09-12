import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

export default function FadeMenu({
  tipoComprobante,
  setTipoComprobante,
  setOpenImpuestos,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImpuestos = (value) => {
    setTipoComprobante(value);
    if (value === "fc-a" || value === "fc-b" || value === "fc-c") {
      setOpenImpuestos(true);
    }
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ marginTop: "1rem", fontFamily: '"Kanit", sans-serif' }}
      >
        {tipoComprobante ? (
          tipoComprobante
        ) : (
          <>
            <span class="material-symbols-outlined">arrow_drop_down</span>
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
        <MenuItem onClick={() => handleImpuestos("ticket")}>
          Ticket (excento)
        </MenuItem>
        <MenuItem onClick={() => handleImpuestos("fc-a")}>FC-A</MenuItem>
        <MenuItem onClick={() => handleImpuestos("fc-b")}>FC-B</MenuItem>
        <MenuItem onClick={() => handleImpuestos("fc-c")}>FC-C</MenuItem>
      </Menu>
    </div>
  );
}
