import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Actions({
  setOpenModal,
  setOpenModalGasto,
  handleFinalizar,
  handleActivar,
  handlePausar,
}) {
  const isMobile = useMediaQuery("(max-width:760px)");

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="space-between"
      sx={{
        marginLeft: "1rem",
        width: isMobile ? "80vw" : "100%",
        height: "2rem",
        fontFamily: '"Kanit", sans-serif',
      }}
    >
      <div style={{ display: "flex" }}>
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          style={{ fontSize: "60%", fontFamily: '"Kanit", sans-serif' }}
          variant="text"
        >
          <span style={{ margin: "0.5rem" }} class="material-symbols-outlined">
            person_add
          </span>
          Empleado
        </Button>
        <Button
          onClick={() => setOpenModalGasto(true)}
          style={{ fontSize: "60%", fontFamily: '"Kanit", sans-serif' }}
          variant="text"
        >
          <span style={{ margin: "0.5rem" }} class="material-symbols-outlined">
            add_circle
          </span>
          Gasto
        </Button>
      </div>

      <div style={{ display: "flex" }}>
        <Button
          style={{
            fontSize: "60%",
            padding: "5px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "center",
            paddingRight: "1rem",
            fontFamily: '"Kanit", sans-serif',
          }}
          color="success"
          variant="outlined"
          onClick={() => handleFinalizar()}
        >
          <span style={{ margin: "0.5rem" }} class="material-symbols-outlined">
            task_alt
          </span>
          Finalizar
        </Button>
        <Button
          style={{
            fontSize: "60%",
            padding: "5px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "center",
            paddingRight: "1rem",
            fontFamily: '"Kanit", sans-serif',
          }}
          color="warning"
          variant="filled"
          onClick={() => handlePausar()}
        >
          <span style={{ margin: "1rem" }} class="material-symbols-outlined">
            pause_circle
          </span>
          Pausar
        </Button>
      </div>
    </Stack>
  );
}
