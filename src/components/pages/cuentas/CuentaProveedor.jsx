import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { TableContext } from "../../context/TableContext";
import { DrawerContext } from "../../context/DrawerContext";

function formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
}

export default function CuentaProveedor() {
  const { gastos, egresos, proveedores } = React.useContext(TableContext);
  const { id } = useParams();
  const { openDrawer } = React.useContext(DrawerContext);

  // Filtrar y ordenar los gastos y egresos por proveedorId y fecha (de más reciente a más antiguo)
  const filteredGastos = gastos.filter((gasto) => gasto.proveedorId === id);
  const filteredEgresos = egresos.filter((egreso) => egreso.proveedorId === id);

  // Combinar y ordenar los gastos y egresos por fecha (de más reciente a más antiguo)
  const combinedEntries = [
    ...filteredGastos.map((gasto) => ({ ...gasto, type: "gasto" })),
    ...filteredEgresos.map((egreso) => ({ ...egreso, type: "egreso" })),
  ].sort((a, b) => {
    const dateB = b.fechaGasto ? b.fechaGasto.seconds : b.fechaEgreso.seconds;
    const dateA = a.fechaGasto ? a.fechaGasto.seconds : a.fechaEgreso.seconds;
    return dateA - dateB; // Sort from most recent to oldest
  });

  let saldo = 0;

  const renderProveedorNombre = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombreComercio : "N/A";
  };

  return (
    <div style={{ marginLeft: openDrawer ? "16.5rem" : "5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <h5
          style={{
            fontWeight: "200",
            marginBottom: "1rem",
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          Estado de cuenta > {renderProveedorNombre(id)} > Historico
        </h5>
      </div>

      <TableContainer component={Paper} style={{ width: "95%" }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#121621", color: "white" }}>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
              >
                Fecha
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Tipo Comprobante
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                N. Comprobante
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Total
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Pagos
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Saldo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedEntries.map((entry) => {
              const total = entry.type === "gasto" ? entry.montoTotal : "";
              const haber = entry.type === "egreso" ? entry.monto : "";

              // Adjust saldo calculation based on the type
              if (entry.type === "gasto") {
                saldo -= total;
              } else if (entry.type === "egreso") {
                saldo += haber;
              }

              return (
                <TableRow
                  key={entry.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "gasto" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    component="th"
                    scope="row"
                  >
                    {formatDate(entry.fechaGasto || entry.fechaEgreso)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "gasto" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {entry.tipoComprobante}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "gasto" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {entry.type === "egreso"
                      ? `EGRESO #${entry.numberOrder} // REF`
                      : ""}
                    {entry.numeroPuntoVenta} - {entry.numeroComprobante}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "gasto" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {total && "-"}
                    {total.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "gasto" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {haber.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "gasto" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {saldo.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
