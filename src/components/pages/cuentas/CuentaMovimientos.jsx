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

export default function CuentaMovimientos() {
  const { ingresos, egresos, clientes, proveedores, conceptos, cuentas } =
    React.useContext(TableContext);
  const { id } = useParams();
  const { openDrawer } = React.useContext(DrawerContext);

  // Filtrar y ordenar los ingresos y egresos por id y fecha (de más reciente a más antiguo)
  const filteredIngresos = ingresos.filter((ingreso) => ingreso.cuenta === id);
  const filteredEgresos = egresos.filter((egreso) => egreso.cuenta === id);

  // Combinar y ordenar los ingresos y egresos por fecha (de más reciente a más antiguo)
  const combinedEntries = [
    ...filteredIngresos.map((ingreso) => ({ ...ingreso, type: "ingreso" })),
    ...filteredEgresos.map((egreso) => ({ ...egreso, type: "egreso" })),
  ].sort((a, b) => {
    const dateB = b.fechaIngreso
      ? b.fechaIngreso.seconds
      : b.fechaEgreso.seconds;
    const dateA = a.fechaIngreso
      ? a.fechaIngreso.seconds
      : a.fechaEgreso.seconds;
    return dateA - dateB; // Sort from most recent to oldest
  });

  let saldo = 0;

  const renderNombre = (id, collection) => {
    const item = collection.find((c) => c.id === id);
    return item ? item.nombre : "";
  };
  const renderProveedor = (id, collection) => {
    const item = collection.find((c) => c.id === id);
    return item ? item.nombreComercio : "";
  };

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "";
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
          Estado de cuenta > {renderNombre(id, clientes)} > Histórico
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
              >
                ID #
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Cuenta
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Cliente (Cobros)
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Proveedor (Gastos)
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Concepto (Pagos)
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
                Total Ingreso
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
                align="right"
              >
                Total Egreso
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
              const totalIngreso = entry.type === "ingreso" ? entry.monto : "";
              const totalEgreso = entry.type === "egreso" ? entry.monto : "";

              // Adjust saldo calculation based on the type
              if (entry.type === "ingreso") {
                saldo += totalIngreso;
              } else if (entry.type === "egreso") {
                saldo -= totalEgreso;
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
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    component="th"
                    scope="row"
                  >
                    {formatDate(entry.fechaIngreso || entry.fechaEgreso)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    component="th"
                    scope="row"
                  >
                    {entry.numberOrder}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {renderNombre(entry.cuenta, cuentas)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {renderNombre(entry.clienteId, clientes)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {entry.type === "egreso" &&
                    entry.proveedorId &&
                    entry.proveedorId.trim() !== ""
                      ? renderProveedor(entry.proveedorId, proveedores)
                      : ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {entry.type === "egreso" &&
                    entry.conceptoPagoId &&
                    entry.conceptoPagoId.trim() !== ""
                      ? renderNombre(entry.conceptoPagoId, conceptos)
                      : ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {entry.numeroComprobante}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {totalIngreso.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
                    }}
                    align="right"
                  >
                    {totalEgreso && "-"}

                    {totalEgreso.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: '"Kanit", sans-serif',
                      backgroundColor:
                        entry.type === "ingreso" ? "#b3ffb3" : "#f1e7e7", // Green for ingreso, Red for egreso
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
