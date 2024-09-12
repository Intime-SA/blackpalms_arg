import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { DrawerContext } from "../../context/DrawerContext";
import { TableContext } from "../../context/TableContext";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date.seconds * 1000);
  return d.toLocaleDateString("es-ES"); // Formato DD/MM/YYYY para el idioma español
}

function Row(props) {
  const { row, tiposHora, empleados, obra, ajustes, id } = props;
  const [open, setOpen] = useState(false);

  console.log(row);

  const getNombrecliente = (idcliente) => {
    const cliente = empleados.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre + " " + cliente.apellido : "Desconocida";
  };

  const sumarHorasTotales = (details) => {
    return details.reduce((total, detail) => {
      return total + detail.horas;
    }, 0);
  };

  const totalEmpleadoObra = row.details.reduce((total, detail) => {
    if (detail.horas > 0 && detail.valorHora > 0) {
      // Ambos positivos
      return total + detail.horas * detail.valorHora;
    } else if (detail.horas < 0 && detail.valorHora < 0) {
      // Ambos negativos
      return total - Math.abs(detail.horas) * Math.abs(detail.valorHora);
    } else {
      // Uno positivo y otro negativo
      return total + detail.horas * detail.valorHora;
    }
  }, 0);

  function calcularTotalHorasObra(details) {
    return details.reduce((total, registro) => {
      return total + registro.horas * registro.valorHoraVenta;
    }, 0);
  }

  const removeWordHora = (tipoHora) => {
    return tipoHora.replace(/hora/gi, "").trim(); // Eliminamos "hora" independientemente de su ubicación en la cadena y luego quitamos los espacios en blanco adicionales
  };
  const horaVentaCalculo = (distancia, horas, ajustes) => {
    let total = 0;

    // Verificar si los parámetros están definidos y tienen los valores necesarios
    if (!distancia || !horas || !ajustes) {
      console.log(
        "Parámetros inválidos: distancia, horas o ajustes no definidos"
      );
      return total; // Retorna 0 si los parámetros son inválidos
    }

    console.log(distancia);
    console.log(horas);
    console.log(ajustes);

    if (distancia.nombre === "Corta Distancia") {
      total += horas * ajustes.horaVenta; // Usa ajustes.horaVenta si es para Corta Distancia
    } else if (distancia.nombre === "Larga Distancia") {
      total += horas * ajustes.horaVentaDistancia; // Usa ajustes.horaLargaDistancia si es para Larga Distancia
    } else {
      console.log("Distancia no reconocida");
    }

    return total;
  };
  const handleDelete = async (idHora, idObra, idEmpleado, horas) => {
    await deleteHoraById(idHora, idObra, idEmpleado, horas);
    // Vuelve a cargar los datos después de eliminar
  };

  const deleteHoraById = async (idHora, idObra, idEmpleado, horas) => {
    if (!idHora || !idObra || !idEmpleado || horas === undefined) {
      console.log(
        "Parámetros inválidos: idHora, idObra, idEmpleado o horas no definidos"
      );
      return;
    }

    console.log(horas);

    // Asegurarse de que horas sea un número
    const horasNum = parseFloat(horas);
    if (isNaN(horasNum)) {
      console.log("Horas no es un número válido");
      return;
    }

    console.log(idHora, idObra, idEmpleado, horasNum);

    try {
      await deleteDoc(doc(db, "horas", idHora));
      console.log(`Documento con ID ${idHora} eliminado correctamente.`);

      const obraRef = doc(db, "obras", idObra);
      const obraSnap = await getDoc(obraRef);

      if (obraSnap.exists()) {
        const obraData = obraSnap.data();
        const horasEmpleado = obraData.horasEmpleado || {};

        if (typeof horasEmpleado[idEmpleado] === "number") {
          horasEmpleado[idEmpleado] = Math.max(
            0,
            horasEmpleado[idEmpleado] - horasNum
          );

          await updateDoc(obraRef, { horasEmpleado });
          console.log(
            `Horas del empleado con ID ${idEmpleado} actualizadas correctamente.`
          );
          window.location.reload();
        } else {
          console.log(
            `El empleado con ID ${idEmpleado} no tiene horas registradas como número válido.`
          );
        }
      } else {
        console.log(`El documento con ID ${idObra} no existe.`);
      }
    } catch (error) {
      console.error(
        "Error al eliminar el documento o actualizar las horas:",
        error
      );
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
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
          {getNombrecliente(row.empleadoId)}
        </TableCell>
        {tiposHora.map((tipo) => (
          <TableCell
            sx={{ fontFamily: '"Kanit", sans-serif' }}
            key={tipo}
            align="right"
          >
            {row[tipo] ? row[tipo] : 0}
          </TableCell>
        ))}
        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          <strong>
            {totalEmpleadoObra.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </strong>
        </TableCell>

        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="right">
          <strong>
            {calcularTotalHorasObra(row.details).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </strong>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          sx={{ fontFamily: '"Kanit", sans-serif' }}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={tiposHora.length + 2}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="detalles">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Fecha Carga
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Fecha Trabajo
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Horas
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Valor Hora
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Valor Hora Venta
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Tipo Hora
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {formatDate(detail.fechaCarga)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {formatDate(detail.fechaHora)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {detail.horas}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {detail.valorHora.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {detail.valorHoraVenta.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {removeWordHora(detail.tipoHora)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        <Button
                          onClick={() =>
                            handleDelete(
                              detail.id,
                              id,
                              row.empleadoId,
                              detail.horas
                            )
                          }
                        >
                          <span class="material-symbols-outlined">delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function GastosHorasPage() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const { openDrawer } = React.useContext(DrawerContext);
  const { empleados, clientes } = React.useContext(TableContext);
  const [obra, setObra] = React.useState([]);

  useEffect(() => {
    const fetchHoras = async () => {
      const q = query(collection(db, "horas"), where("obraId", "==", id));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      const allTiposHora = new Set();
      const groupedData = data.reduce((acc, curr) => {
        allTiposHora.add(curr.tipoHora);
        if (!acc[curr.empleadoId]) {
          acc[curr.empleadoId] = { empleadoId: curr.empleadoId, details: [] };
        }
        acc[curr.empleadoId][curr.tipoHora] =
          (acc[curr.empleadoId][curr.tipoHora] || 0) + curr.horas;
        acc[curr.empleadoId].details.push({
          id: curr.id,
          fechaHora: curr.fechaHora,
          fechaCarga: curr.fechaCarga,
          horas: curr.horas,
          valorHora: curr.valorHora,
          tipoHora: curr.tipoHora,
          valorHoraVenta: curr.valorHoraVenta,
        });
        return acc;
      }, {});

      setTiposHora(Array.from(allTiposHora));
      setRows(Object.values(groupedData));
    };

    fetchHoras();
  }, [id]);

  const [ajustes, setAjustes] = useState([]);

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

  function capitalizeAndSpaceAfterHora(tipoHora) {
    // Convertir la primera letra a mayúscula
    let capitalized = tipoHora.charAt(0).toUpperCase() + tipoHora.slice(1);

    // Agregar un espacio después de la palabra "Hora"
    capitalized = capitalized.replace(/Hora/g, "Hora ");

    return capitalized;
  }

  React.useEffect(() => {
    const fetchObra = async () => {
      try {
        const obraDoc = await getDoc(doc(db, "obras", id));
        if (obraDoc.exists()) {
          setObra(obraDoc.data());
          console.log(obra);
          // Realiza cualquier otra operación que necesites con los datos de la obra
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching obra:", error);
      }
    };

    fetchObra();
  }, []);

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "Desconocida";
  };

  return (
    <div
      style={{
        fontFamily: '"Kanit", sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {obra && (
        <div style={{ marginLeft: openDrawer ? "16.5rem" : "6.5rem" }}>
          <h6>En la Obra ID: #{id || "No disponible"}</h6>
          <p>
            <strong>Lugar:</strong> {obra.lugar || "No disponible"}
          </p>
          <p>
            <strong>Distancia:</strong>{" "}
            {obra.distancia?.nombre || "No disponible"}
          </p>
          <p>
            <strong>Fecha Inicio:</strong>{" "}
            {obra.fechaInicio ? formatDate(obra.fechaInicio) : "No disponible"}
          </p>
        </div>
      )}
      <h5
        style={{
          marginLeft: openDrawer ? "16.5rem" : "6.5rem",
          fontWeight: "200",
          marginBottom: "1rem",
          marginTop: "1rem",
        }}
      >
        {getNombrecliente(obra.cliente)} > {obra.descripcion}
      </h5>
      <TableContainer
        component={Paper}
        style={{
          width: openDrawer ? "80%" : "90%",
          marginLeft: openDrawer ? "16.5rem" : "6.5rem",
          color: "white",
          fontFamily: '"Kanit", sans-serif',
        }}
      >
        <Table aria-label="collapsible table">
          <TableHead
            sx={{
              color: "white",
              fontFamily: '"Kanit", sans-serif',
              backgroundColor: "#121621",
            }}
          >
            <TableRow>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
              />
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
              >
                Empleado
              </TableCell>
              {tiposHora.map((tipo) => (
                <TableCell
                  sx={{ fontFamily: '"Kanit", sans-serif' }}
                  style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
                  key={tipo}
                  align="right"
                >
                  {capitalizeAndSpaceAfterHora(tipo)}
                </TableCell>
              ))}
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
                align="right"
              >
                Total Hora Costo
              </TableCell>
              <TableCell
                sx={{ fontFamily: '"Kanit", sans-serif' }}
                style={{ color: "white", fontFamily: '"Kanit", sans-serif' }}
                align="right"
              >
                Total Hora Venta
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.empleadoId}
                row={row}
                tiposHora={tiposHora}
                empleados={empleados}
                ajustes={ajustes}
                obra={obra}
                id={id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
