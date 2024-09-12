import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Alert, AlertTitle, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Cards({
  clientes,
  obras,
  setOpenObra,
  setIdObra,
  setIdCliente,
  idObra,
  idCliente,
}) {
  const openObra = (idObra, clienteId) => {
    setOpenObra(true);
    setIdObra(idObra);
    setIdCliente(clienteId);
    console.log(idObra);
    console.log(clienteId);
  };

  const renderEstado = (estado) => {
    console.log(estado);
    if (estado === "enProceso") {
      return (
        <Alert
          style={{ fontFamily: '"Kanit", sans-serif', borderRadius: "0px" }}
          variant="filled"
          severity="info"
        >
          En proceso
        </Alert>
      );
    } else if (estado === "finalizado") {
      return (
        <Alert
          style={{ fontFamily: '"Kanit", sans-serif', borderRadius: "0px" }}
          variant="filled"
          severity="success"
        >
          Finalizado
        </Alert>
      );
    } else if (estado === "pausado") {
      return (
        <Alert
          style={{ fontFamily: '"Kanit", sans-serif', borderRadius: "0px" }}
          variant="filled"
          severity="warning"
        >
          En Pausa
        </Alert>
      );
    } else if (estado === "cancelado") {
      return (
        <Alert
          style={{ fontFamily: '"Kanit", sans-serif', borderRadius: "0px" }}
          variant="filled"
          severity="error"
        >
          Cancelada
        </Alert>
      );
    }
  };

  const navigate = useNavigate();

  return (
    <>
      {clientes.map((cliente) => {
        const obrasCliente = obras.filter(
          (obra) => obra.cliente === cliente.id
        );
        return (
          <React.Fragment key={cliente.id}>
            {obrasCliente.map((obra) => (
              <Card
                key={obra.id}
                sx={{
                  minWidth: 270,
                  maxWidth: 270,
                  marginBottom: 20,
                  marginBottom: 2,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: 8,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <CardActionArea onClick={() => navigate(`/obra/${obra.id}`)}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={cliente.imagen ? cliente.imagen : null}
                    alt="Cliente Image"
                  />
                  <div
                    style={{
                      fontFamily: '"Kanit", sans-serif',
                      borderRadius: "0px",
                    }}
                  >
                    {renderEstado(obra.estado)}
                  </div>
                  <CardContent
                    style={{
                      minHeight: 150,
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {cliente.nombre}
                    </Typography>
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="body2"
                      color="text.secondary"
                      fontSize="80%"
                    >
                      {obra.descripcion}
                    </Typography>
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {obra.lugar}
                    </Typography>
                    <Typography
                      style={{ fontFamily: '"Kanit", sans-serif' }}
                      variant="body2"
                      color="text.secondary"
                    >
                      Presupuesto Estimado: <br />
                      <br />
                      <strong>
                        {obra.presupuestoInicial.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}
