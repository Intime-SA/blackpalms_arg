import React, { useContext } from "react";
import { TableContext } from "../../context/TableContext";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

const Empleados = () => {
  // Asegúrate de que TableContext proporciona empleados
  const navigate = useNavigate();

  const { clientes, empleados, horas } = React.useContext(TableContext);

  const exportToExcel = () => {
    // Definir el encabezado
    const header = [
      "Cliente ID",
      "Distancia",
      "Empleado ID",
      "Fecha Carga",
      "Fecha Hora",
      "Horas",
      "Obra ID",
      "Tipo Hora",
      "Valor Hora",
    ];

    // Mapear los datos de 'horas'
    const data = horas.map((hora) => {
      const filaPedido = [
        hora.clienteId,
        hora.distancia,
        hora.empleadoId, // Asegúrate de que 'horaId' sea correcto si debe ser 'empleadoId'
        new Date(hora.fechaCarga.seconds * 1000).toLocaleString(),
        new Date(hora.fechaHora.seconds * 1000).toLocaleString(),
        hora.horas,
        hora.obraId,
        hora.tipoHora,
        hora.valorHora,
      ];

      return filaPedido;
    });

    // Combinar el encabezado y los datos
    const wsData = [header, ...data];

    // Crear la hoja de trabajo y el libro
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Horas");

    // Exportar el archivo Excel
    XLSX.writeFile(wb, "Horas.xlsx");
  };

  return (
    <div style={{ marginLeft: "16.5rem", marginTop: "2rem", width: "80%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          fontFamily: '"Kanit", sans-serif',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/agregarEmpleado")}
          style={{ margin: "1rem", fontFamily: '"Kanit", sans-serif' }}
        >
          Agregar Empleado
        </Button>
      </div>
      {empleados.map((empleado, index) => (
        <Card key={index} elevation={3} sx={{ marginBottom: "1.5rem" }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              {empleado.nombre} {empleado.apellido}
            </Typography>

            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Teléfono: {empleado.telefono}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ fontFamily: '"Kanit", sans-serif' }}
            >
              Fecha de Alta:{" "}
              {new Date(empleado.fechaAlta.seconds * 1000).toLocaleString(
                "es-AR"
              )}
            </Typography>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "2rem",
              }}
            >
              <Typography
                variant="body1"
                gutterBottom
                style={{ fontFamily: '"Kanit", sans-serif' }}
              >
                Cargo:{" "}
                <strong>
                  {empleado.categoriaEmpleado &&
                  empleado.categoriaEmpleado.nombre
                    ? empleado.categoriaEmpleado.nombre
                    : "No asignado"}
                </strong>
              </Typography>
              <div>
                <Tooltip title="Editar Empleado">
                  <Link
                    to={`/empleadosEdit/${empleado.id}`}
                    aria-label="Editar"
                  >
                    <span class="material-symbols-outlined">edit</span>
                  </Link>
                </Tooltip>
                <Tooltip title="Reporte de Horas">
                  <Link
                    to={`/horasGlobalesPage/${empleado.id}`}
                    aria-label="Editar"
                    style={{ marginLeft: "1rem" }}
                  >
                    <span class="material-symbols-outlined">lab_profile</span>
                  </Link>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Empleados;
