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

export default function CuentaCliente() {
  const { ingresos, ventas, clientes, cuentas } =
    React.useContext(TableContext);
  const { id } = useParams();
  const { openDrawer } = React.useContext(DrawerContext);

  // Filtrar y ordenar los ingresos y ventas por clienteId y fecha (de más reciente a más antiguo)
  const filteredIngresos = ingresos.filter(
    (ingreso) => ingreso.clienteId === id
  );
  const filteredVentas = ventas.filter((venta) => venta.clienteId === id);

  // Combinar y ordenar los ingresos y ventas por fecha (de más reciente a más antiguo)
  const combinedEntries = [
    ...filteredIngresos.map((ingreso) => ({ ...ingreso, type: "ingreso" })),
    ...filteredVentas.map((venta) => ({ ...venta, type: "venta" })),
  ].sort((a, b) => {
    const dateB = b.fechaIngreso
      ? b.fechaIngreso.seconds
      : b.fechaVenta.seconds;
    const dateA = a.fechaIngreso
      ? a.fechaIngreso.seconds
      : a.fechaVenta.seconds;
    return dateA - dateB; // Sort from most recent to oldest
  });

  let saldo = 0;

  const renderClienteNombre = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "N/A";
  };

  const renderCuentaNombre = (cuentaId) => {
    const cuenta = cuentas.find((c) => c.id === cuentaId);
    return cuenta ? cuenta.nombre : "N/A";
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
          Estado de cuenta > {renderClienteNombre(id)} > Historico
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
                Cuenta (Ingreso)
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
                Cobros (ingresos)
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
              const total = entry.type === "venta" ? entry.montoTotal : "";
              const debe = entry.type === "ingreso" ? entry.monto : "";

              // Adjust saldo calculation based on the type
              if (entry.type === "venta") {
                saldo += total;
              } else if (entry.type === "ingreso") {
                saldo -= debe;
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
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for venta, Red for ingreso
                    }}
                    component="th"
                    scope="row"
                  >
                    {formatDate(entry.fechaVenta || entry.fechaIngreso)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {renderCuentaNombre(entry.cuenta)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for gasto, Red for egreso
                    }}
                    align="right"
                  >
                    {entry.tipoComprobante}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for venta, Red for ingreso
                    }}
                    align="right"
                  >
                    {entry.type === "ingreso"
                      ? `INGRESO #${entry.numberOrder} // REF`
                      : ""}
                    {entry.numeroPuntoVenta} - {entry.numeroComprobante}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for venta, Red for ingreso
                    }}
                    align="right"
                  >
                    {total.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for venta, Red for ingreso
                    }}
                    align="right"
                  >
                    {debe && "-"}
                    {debe.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "venta" ? "#f1e7e7" : "#b3ffb3", // Green for venta, Red for ingreso
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
