import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";

function Row(props) {
  const {
    row,
    setStatusDelete,
    statusDelete,
    setEditingIngresoId,
    setOpenForm,
    editingIngresoId,
    setStatusEdit,
    statusEdit,
  } = props;
  const [open, setOpen] = useState(false);

  const { clientes, cuentas } = useContext(TableContext); // Agregado clientes al contexto

  const deleteIngreso = async (id) => {
    try {
      await deleteDoc(doc(db, "ingresos", id));
      setStatusDelete(!statusDelete);
      console.log(`Ingreso ${id} eliminado correctamente.`);
    } catch (error) {
      console.error("Error deleting ingreso: ", error);
    }
  };

  const editIngreso = (id) => {
    setEditingIngresoId(id);
    setOpenForm(true); // Asumiendo que se abre un formulario para editar
    setStatusEdit(!statusEdit);
  };

  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return "No disponible"; // Manejar caso de fecha nula
    const date = new Date(
      firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1000000
    );
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son base cero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderClienteNombre = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "N/A";
  };

  const renderCuentaNombre = (cuentaId) => {
    const cuenta = cuentas.find((c) => c.id === cuentaId);
    return cuenta ? cuenta.nombre : "N/A";
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          component="th"
          scope="row"
        >
          {row.numberOrder}
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          component="th"
          scope="row"
        >
          {renderClienteNombre(row.clienteId)}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="center">
          {row.monto.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="center">
          {formatDate(row.fechaIngreso)}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="center">
          {renderCuentaNombre(row.cuenta)}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => deleteIngreso(row.id)}>
              <span className="material-symbols-outlined">delete</span>
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              ></Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Descripción
                    </TableCell>

                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      Tipo
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      Cuenta
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      component="th"
                      scope="row"
                    >
                      {row.descripcion}
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      {row.tipoComprobante}
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      {row.cuenta}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    descripcion: PropTypes.string.isRequired,
    monto: PropTypes.number.isRequired,
    fecha: PropTypes.string.isRequired,
    categoria: PropTypes.string.isRequired,
  }).isRequired,
};

function IngresosListDetail({
  ingresos,
  setStatusDelete,
  statusDelete,
  setOpenForm,
  setStatusEdit,
  statusEdit,
}) {
  const [editingIngresoId, setEditingIngresoId] = useState(null);

  return (
    <TableContainer
      component={Paper}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
    >
      <Table aria-label="collapsible table">
        <TableHead sx={{ fontFamily: '"Kanit", sans-serif' }}>
          <TableRow style={{ backgroundColor: "#121621", color: "white" }}>
            <TableCell />
            <TableCell
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              ID #
            </TableCell>
            <TableCell
              sx={{ fontFamily: '"Kanit", sans-serif', color: "white" }}
            >
              Cliente
            </TableCell>

            <TableCell
              sx={{
                fontFamily: '"Kanit", sans-serif',
                color: "white",
              }}
              align="center"
            >
              Monto
            </TableCell>
            <TableCell
              sx={{
                fontFamily: '"Kanit", sans-serif',
                color: "white",
              }}
              align="center"
            >
              Fecha
            </TableCell>
            <TableCell
              sx={{
                fontFamily: '"Kanit", sans-serif',
                color: "white",
              }}
              align="center"
            >
              Cuenta (Acreditacion)
            </TableCell>
            <TableCell
              sx={{
                fontFamily: '"Kanit", sans-serif',
                color: "white",
                textAlign: "center",
              }}
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingresos.map((ingreso) => (
            <Row
              key={ingreso.id}
              row={ingreso}
              setStatusDelete={setStatusDelete}
              statusDelete={statusDelete}
              setEditingIngresoId={setEditingIngresoId}
              setOpenForm={setOpenForm}
              editingIngresoId={editingIngresoId}
              setStatusEdit={setStatusEdit}
              statusEdit={statusEdit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

IngresosListDetail.propTypes = {
  ingresos: PropTypes.array.isRequired,
  setStatusDelete: PropTypes.func.isRequired,
  statusDelete: PropTypes.bool.isRequired,
  setOpenForm: PropTypes.func.isRequired,
  setStatusEdit: PropTypes.func.isRequired,
  statusEdit: PropTypes.bool.isRequired,
};

export default IngresosListDetail;
