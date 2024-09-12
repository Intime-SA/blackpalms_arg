import React, { useContext } from "react";
import { TableContext } from "../../context/TableContext";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Cuentas = () => {
  const { cuentas } = useContext(TableContext);
  const navigate = useNavigate();

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1.5rem",
        }}
      >
        <Button
          variant="contained"
          style={{ fontFamily: '"Kanit", sans-serif' }}
          onClick={() => navigate("agregarCuenta")}
        >
          Agregar Cuenta
        </Button>
      </div>
      {cuentas.map((cuenta, index) => (
        <Card key={index} elevation={3} sx={{ marginBottom: "1.5rem" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Cuenta {index + 1}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif', marginTop: "1rem" }}
            >
              Nombre: {cuenta.nombre}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Tipo: {cuenta.tipo}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              CBU: {cuenta.cbu}
            </Typography>
          </CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <Button onClick={() => navigate(`cuentaMovimientos/${cuenta.id}`)}>
              <span className="material-symbols-outlined">search</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Cuentas;
