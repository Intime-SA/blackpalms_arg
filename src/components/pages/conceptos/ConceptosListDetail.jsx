import React, { useState } from "react";
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
import { Button, Tooltip } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { deleteUser, getAuth } from "firebase/auth";

function Row(props) {
  const {
    row,
    setStatusDelete,
    statusDelete,
    setEditingClientId,
    setOpenForm,
    editingClientId,
    setStatusEdit,
    statusEdit,
  } = props;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [toname, setToname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = (email, toname) => {
    setToname(toname);
    setEmail(email);
    setOpenModal(true);
  };

  const phoneNumber = (number) => {
    console.log(number);
    handleWhatsAppClick(number);
  };

  const handleWhatsAppClick = (number) => {
    const phoneNumber = `54${number}`;
    const message = "Hola, te contactamos de Kaury Mayorista MDP";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappLink, "_blank");
  };

  const renderShippingData = () => {
    if (row.datosEnvio && Object.keys(row.datosEnvio).length > 0) {
      return (
        <div>
          <Typography variant="body1">Datos de Envío:</Typography>
          <ul>
            {Object.entries(row.datosEnvio).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <Typography variant="body1">
          No existen datos de envío guardados para este cliente.
        </Typography>
      );
    }
  };

  const client = () => {
    if (row.roll === "customerDirect") {
      return "Kaury";
    } else if (row.roll === "customer") {
      return "Usuario WEB";
    }
    return;
  };

  const deleteUsuario = async (id) => {
    const auth = getAuth();
    try {
      await deleteUser(auth, id);
      await deleteDoc(doc(db, "users", id));
      setStatusDelete(!statusDelete);
      console.log(`Usuario ${id} eliminado correctamente.`);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
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
          <strong>{row.nombre}</strong>
        </TableCell>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          component="th"
          scope="row"
          align="center"
        >
          {row.descripcion}
        </TableCell>
        {/*         <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => editClient(row.id)}>
              <span className="material-symbols-outlined">edit</span>
            </Button>
          </div>
        </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                      Sub-Conceptos
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
                      {Object.values(row.subconceptos).map((doc) => (
                        <h5 key={doc.id}>{doc.nombre}</h5>
                      ))}
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      component="th"
                      scope="row"
                    >
                      {Object.values(row.subconceptos).map((doc) => (
                        <h5 key={doc.id}>{doc.descripcion}</h5>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow style={{ width: "90%" }} colSpan={10}>
        <TableCell style={{ width: "90%" }} colSpan={10}>
          <div>
            {/* {isEditing && (
              <EditClient
                setEditingClientId={setEditingClientId}
                editingClientId={editingClientId}
                setOpenForm={setOpenForm}
                setStatusEdit={setStatusEdit}
                statusEdit={statusEdit}
                setIsEditing={setIsEditing}
              />
            )} */}
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function ConceptosListDetail({
  concepts,
  setStatusDelete,
  statusDelete,
  setOpenForm,
  setStatusEdit,
  statusEdit,
}) {
  const [editingClientId, setEditingClientId] = useState(null);

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
              align="left"
            >
              Conceptos
            </TableCell>
            <TableCell
              sx={{
                fontFamily: '"Kanit", sans-serif',
                color: "white",
                textAlign: "center",
              }}
            >
              Descripcion
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {concepts.map((user) => (
            <Row
              key={user.id}
              row={user}
              setStatusDelete={setStatusDelete}
              statusDelete={statusDelete}
              setEditingClientId={setEditingClientId}
              setOpenForm={setOpenForm}
              editingClientId={editingClientId}
              setStatusEdit={setStatusEdit}
              statusEdit={statusEdit}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ConceptosListDetail.propTypes = {
  concepts: PropTypes.array.isRequired,
};

export default ConceptosListDetail;
