import React, { useContext, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
/* import ClientShippingTooltip from "./ClientShippingTooltip"; */
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
/* import EditClient from "./EditClient"; */
/* import emailjs from "emailjs-com"; */
/* import EmailModal from "./EmailModal"; */
import { deleteUser, getAuth } from "firebase/auth";
import { DrawerContext } from "../../context/DrawerContext";

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
    navigate,
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

  /*  const sendEmail = (subject, message, toname) => {
      emailjs
        .send(
          "service_trtdi6v",
          "template_59j1wkl",
          {
            from_email: email,
            subject: subject,
            message: message,
            to_name: toname,
          },
          "uAivPuB-RJ_3LBVlN"
        )
        .then(
          (response) => {
            console.log("Correo electrónico enviado con éxito:", response);
          },
          (error) => {
            console.error("Error al enviar el correo electrónico:", error);
          }
        );
    }; */

  const phoneNumber = (number) => {
    console.log(number);
    handleWhatsAppClick(number);
  };

  const handleWhatsAppClick = (number) => {
    // Cambia '1234567890' por el número de teléfono del cliente
    const phoneNumber = `54${number}`;
    const message = "Hola, te contactamos de Kaury Mayorista MDP";

    // Crea el enlace con el API de WhatsApp Business
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Abre el enlace en una nueva ventana
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

  /*   console.log(row.fechaInicio); */

  /*   const fechaInicio = new Date(row.fechaInicio.seconds * 1000); */

  // Formatear la fecha como string en formato dd/mm/yyyy
  /*   const formattedFechaInicio = `${fechaInicio.getDate()}/${
      fechaInicio.getMonth() + 1
    }/${fechaInicio.getFullYear()}`; */

  const client = () => {
    if (row.roll === "customerDirect") {
      let client = "Kaury";
      return client;
    } else if (row.roll === "customer") {
      let client = "Usuario WEB";
      return client;
    }

    return;
  };
  const deleteUsuario = async (id) => {
    const auth = getAuth(); // Obteniendo la instancia de auth
    try {
      // Eliminar el usuario del servicio de autenticación de Firebase
      await deleteUser(auth, id);

      // Eliminar el usuario de la colección "users" en Firestore
      await deleteDoc(doc(db, "users", id));

      setStatusDelete(!statusDelete);
      console.log(`Usuario ${id} eliminado correctamente.`);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  /*   const editClient = async (id) => {
    try {
      setEditingClientId(id);
      setIsEditing(true);
    } catch (error) {
      console.log(error);
    }
  }; */

  console.log(row); /* */

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
          {row.nombreComercio}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="center">
          {row.datosFiscales.cuit}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="center">
          {row.categoria}
        </TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}></TableCell>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="rigth">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/*             <Button onClick={() => editClient(row.id)}>
              <span class="material-symbols-outlined">edit</span>
            </Button> */}
            <Button onClick={() => navigate(`cuentaProveedor/${row.id}`)}>
              <span class="material-symbols-outlined">search</span>
            </Button>
            {/*             <Tooltip title={renderShippingData()} arrow>
              <Button>
                <span class="material-symbols-outlined">local_shipping</span>
              </Button>
            </Tooltip>
            <Button onClick={() => handleOpenModal(row.email, row.name)}>
              <span class="material-symbols-outlined">mail</span>
            </Button> */}
            {/*             <EmailModal
                open={openModal}
                handleClose={handleCloseModal}
                sendEmail={sendEmail}
                email={email}
                toname={toname}
              /> */}
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
                      Email
                    </TableCell>
                    {/*                     <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif'}}
                    >
                      Fecha Adhesion
                    </TableCell> */}
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      Contacto
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow /* key={row.fec} */>
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      component="th"
                      scope="row"
                    >
                      {row.email}
                    </TableCell>
                    {/*                     <TableCell
                        sx={{ fontFamily: '"Kanit", sans-serif'}}
                      >
                        {formattedFechaInicio}
                      </TableCell> */}
                    <TableCell
                      sx={{ fontFamily: '"Kanit", sans-serif' }}
                      align="right"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          style={{ marginBottom: "0.5rem" }}
                          onClick={() => phoneNumber(row.telefono)}
                        >
                          <img
                            style={{ marginTop: "0.5rem" }}
                            width="20rem"
                            src="https://firebasestorage.googleapis.com/v0/b/mayoristakaurymdp.appspot.com/o/whatsapp.svg?alt=media&token=83bb48a7-7405-4a69-867c-44568a7e108f"
                            alt="logowsp"
                          />
                        </Button>
                      </div>
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
            {/*  {isEditing && ( // Renderizar el componente EditProducts si se está editando un producto
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

/* Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  }; */

function ProveedoresListDetail({
  customers,
  setStatusDelete,
  statusDelete,
  setOpenForm,
  setStatusEdit,
  statusEdit,
}) {
  // Estado para indicar si se está editando el producto
  const [editingClientId, setEditingClientId] = useState(null);

  const { openDrawer } = useContext(DrawerContext);

  console.log(customers); // Estado para almacenar el ID del producto que se está editando

  const navigate = useNavigate();

  // Aquí se espera la prop products
  return (
    <div>
      <TableContainer
        component={Paper}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
      >
        <Table aria-label="collapsible table">
          <TableHead sx={{ fontFamily: '"Kanit", sans-serif' }}>
            <TableRow style={{ backgroundColor: "#121621", color: "white" }}>
              <TableCell />
              <TableCell
                sx={{
                  fontFamily: '"Kanit", sans-serif',
                  color: "white",
                }}
                align="left"
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
                Cuit
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: '"Kanit", sans-serif',
                  color: "white",
                }}
                align="center"
              >
                Categoria
              </TableCell>
              <TableCell
                sx={{
                  fontFamily: '"Kanit", sans-serif',
                  color: "white",
                }}
                align="center"
              ></TableCell>
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
            {customers.map((user) => (
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
                navigate={navigate}
              />
            ))}
          </TableBody>
        </Table>
        <table></table>
      </TableContainer>
    </div>
  );
}

ProveedoresListDetail.propTypes = {
  products: PropTypes.array.isRequired, // Definiendo las propTypes
};

export default ProveedoresListDetail;
