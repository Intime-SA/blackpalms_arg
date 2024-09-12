import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AddCircleOutlined, Delete as DeleteIcon } from "@mui/icons-material";
import { db } from "../../../../firebaseConfig";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import useMediaQuery from "@mui/material/useMediaQuery";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ModalHoraValor from "./ModalValorHora";
import { deepOrange, deepPurple } from "@mui/material/colors";

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const CustomAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  [theme.breakpoints.down("sm")]: {
    width: 48,
    height: 48,
  },
}));

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: "320px",
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
}));

export default function ListEmpleado({
  idObra,
  setCambioHoras,
  idCliente,
  arrayEmpleados,
  setArrayEmpleados,
  actualizarEmpleados,
  setOpenProgress,
  openProgress,
  setTotalHorasEmpleado,
  setActualizarEmpleados,
}) {
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(true);

  const [arrayObras, setArrayObras] = useState([]);
  const [sumaHoras, setSumarHoras] = useState(false);
  const [loadingEmpleados, setLoadingEmpleados] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const [horaValor, setHoraValor] = useState([]);
  const [selectedHora, setSelectedHora] = useState(0);
  const [tipoHora, setTipoHora] = useState("");

  const [actionData, setActionData] = useState(null);
  const [executeActionFlag, setExecuteActionFlag] = useState(false);
  const [fechaHora, setFechaHora] = useState(null);
  const [fechaHoraFormateada, setFechaHoraFormateada] = useState(null);

  const [horaEdit, setHoraEdit] = useState(null);

  const [ajustes, setAjustes] = useState([]);

  const isMobile = useMediaQuery("(max-width:760px)");

  useEffect(() => {
    const consultaEmpleados = async () => {
      try {
        const collectionEmpleados = collection(db, "empleados");
        const EmpleadosSnapshot = await getDocs(collectionEmpleados);
        const EmpleadosData = EmpleadosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Id de la obra que estás buscando
        // Supongamos que este es el ID de la obra buscada

        // Filtrar los empleados que tienen la obra activa con el idObra especificado
        const empleadosConObraActiva = EmpleadosData.filter(
          (empleado) =>
            empleado.obrasActivas && empleado.obrasActivas.includes(idObra)
        );

        // Agregar empleados que tienen la obra activa con el idObra especificado al arrayEmpleados
        setArrayEmpleados(empleadosConObraActiva);
      } catch (error) {
        console.error("Error fetching Empleados:", error);
      }
    };

    consultaEmpleados();
    setActualizarEmpleados(false);
  }, [actualizarEmpleados, horaEdit]);

  useEffect(() => {
    const consultaObra = async () => {
      try {
        const collectionObras = collection(db, "obras");
        const ObrasSnapshot = await getDocs(collectionObras);
        const ObrasData = ObrasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Id de la obra que estás buscando
        // Supongamos que este es el ID de la obra buscada

        // Filtrar los Obras que tienen la obra activa con el idObra especificado

        // Agregar Obras que tienen la obra activa con el idObra especificado al arrayObras
        setArrayObras(ObrasData);

        // Apagar la señal de sumaHoras después de cargar los datos
        setSumarHoras(false);
        setCambioHoras(false);
      } catch (error) {
        console.error("Error fetching Obras:", error);
      }
    };

    consultaObra();
  }, [sumaHoras, openProgress]);

  const consultaHoras = (idObra, empleadoId) => {
    const obra = arrayObras.find((obra) => obra.id === idObra);
    if (obra && obra.horasEmpleado && obra.horasEmpleado[empleadoId]) {
      return obra.horasEmpleado[empleadoId];
    }
    return 0;
  };

  const sumarHoras = (idObra, empleadoId) => {
    setLoadingEmpleados((prevLoadingEmpleados) => ({
      ...prevLoadingEmpleados,
      [empleadoId]: true,
    }));
    setOpenModal(true);
    setOpenProgress(true);

    setActionData({
      idObra,
      empleadoId,
      action: "sumar",
    });
    setExecuteActionFlag(true);
  };

  const restarHoras = (idObra, empleadoId) => {
    setLoadingEmpleados((prevLoadingEmpleados) => ({
      ...prevLoadingEmpleados,
      [empleadoId]: true,
    }));
    setOpenModal(true);
    setOpenProgress(true);
    setActionData({
      idObra,
      empleadoId,
      action: "restar",
    });
    setExecuteActionFlag(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "ajustes", "valoresHoras");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAjustes(docSnap.data());
        } else {
          console.log("No existe el documento");
        }
      } catch (error) {
        console.error("Error al obtener los ajustes:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const executeAction = async () => {
      if (!actionData) return;

      const { idObra, empleadoId, action } = actionData;

      try {
        const obraRef = doc(db, "obras", idObra);
        const obraSnapshot = await getDoc(obraRef);
        const obraData = obraSnapshot.data().horasEmpleado;
        const obraDistancia = obraSnapshot.data().distancia.value;

        if (action === "sumar") {
          obraData[empleadoId] = (obraData[empleadoId] || 0) + horaEdit;
        } else if (action === "restar") {
          obraData[empleadoId] = (obraData[empleadoId] || 0) - horaEdit;
        }

        await updateDoc(obraRef, { horasEmpleado: obraData });
        await addDoc(collection(db, "horas"), {
          clienteId: idCliente,
          empleadoId: empleadoId,
          obraId: idObra,
          fechaCarga: serverTimestamp(),
          fechaHora: fechaHoraFormateada
            ? fechaHoraFormateada
            : serverTimestamp(),
          horas: action === "sumar" ? horaEdit : -horaEdit,
          valorHora: action === "sumar" ? selectedHora : -selectedHora,
          tipoHora: tipoHora,
          distancia: obraDistancia,
          valorHoraVenta:
            obraDistancia === "corta"
              ? ajustes.horaVenta
              : ajustes.horaVentaDistancia,
        });
      } catch (error) {
        console.error(`Error al ${action} horas:`, error);
      } finally {
        setCambioHoras(true);
        setOpenProgress(false);
        setLoadingEmpleados((prevLoadingEmpleados) => ({
          ...prevLoadingEmpleados,
          [empleadoId]: false,
        }));
        setActionData(null); // Restablecer actionData a null
        setSelectedHora("");
        setExecuteActionFlag(false); // Restablecer la bandera de ejecución
      }
    };

    if (selectedHora && executeActionFlag) {
      executeAction();
    }
  }, [selectedHora, executeActionFlag, actionData]);

  const convertirAFirestoreTimestamp = (fechaHora) => {
    if (fechaHora) {
      const fechaJavaScript = fechaHora.$d;

      // Crea un objeto Date de JavaScript a partir de la fecha extraída
      const fechaDate = new Date(fechaJavaScript);

      // Convierte el objeto Date en una marca de tiempo de Firestore
      const timestamp = Timestamp.fromDate(fechaDate);

      return timestamp;
    }
    // Extrae la fecha del objeto M2
  };

  useEffect(() => {
    if (fechaHora) {
      const fechaFormateada = convertirAFirestoreTimestamp(fechaHora);
      setFechaHoraFormateada(fechaFormateada);
    }
  }, [fechaHora]);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <Box
      sx={{
        flexGrow: 0,
        maxWidth: 300,
      }}
    >
      <ModalHoraValor
        openModal={openModal}
        setOpenModal={setOpenModal}
        horaValor={horaValor}
        setSelectedHora={setSelectedHora}
        selectedHora={selectedHora}
        setTipoHora={setTipoHora}
        tipoHora={tipoHora}
        setFechaHora={setFechaHora}
        fechaHora={fechaHora}
        setHoraEdit={setHoraEdit}
        horaEdit={horaEdit}
        setHoraValor={setHoraValor}
        actionData={actionData}
      />
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            width: isMobile ? "80vw" : "80vw",
            paddingLeft: "0px",
            marginLeft: "0px",
          }}
        >
          <List
            dense={dense}
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "center" : "flex-start",
              paddingLeft: 0,
            }}
          >
            {arrayEmpleados.map((empleado) => (
              <ListItem
                sx={{
                  width: isMobile ? "100%" : "300px",
                  padding: "1rem",

                  maxWidth: "90vw",
                  height: "200px",
                  borderRadius: 8, // Ajusta el valor según tus preferencias
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Agrega una sombra
                  backgroundColor: "#f5f5f5", // Color de fondo sutil
                  marginBottom: "1rem",
                  marginLeft: isMobile ? "0px" : "1rem",
                  fontFamily: '"Kanit", sans-serif',
                }}
                key={empleado.id}
              >
                <ListItemAvatar
                  sx={{
                    paddingBottom: "5rem",
                  }}
                >
                  <Avatar sx={{ bgcolor: deepOrange[500] }}>
                    <strong>{empleado.nombre.charAt(0)}</strong>
                  </Avatar>
                </ListItemAvatar>
                <Divider />
                <ListItemText
                  style={{
                    paddingBottom: "5rem",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  {" "}
                  <h5
                    style={{ fontWeight: "900" }}
                  >{`${empleado.nombre} ${empleado.apellido}`}</h5>
                  <br />
                </ListItemText>
                <h6>{secondary ? empleado.telefono : null}</h6>

                <ListItemSecondaryAction
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "3.5rem",
                    marginRight: "1rem",
                    fontFamily: '"Kanit", sans-serif',
                  }}
                >
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => sumarHoras(idObra, empleado.id, horaEdit)}
                  >
                    <AddCircleOutlined />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    {loadingEmpleados[empleado.id] ? (
                      <CircularProgress />
                    ) : (
                      <ListItemText />
                    )}
                    <h4 style={{ fontFamily: '"Kanit", sans-serif' }}>
                      {consultaHoras(idObra, empleado.id)}
                    </h4>
                  </IconButton>
                  <IconButton
                    onClick={() => restarHoras(idObra, empleado.id, horaEdit)}
                    edge="end"
                    aria-label="delete"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  {/*                   <IconButton
                    onClick={() => restarHoras(idObra, empleado.id, 1)}
                    edge="end"
                    aria-label="delete"
                  >
                    <span class="material-symbols-outlined">
                      exposure_neg_1
                    </span>
                  </IconButton> */}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Box>
  );
}
