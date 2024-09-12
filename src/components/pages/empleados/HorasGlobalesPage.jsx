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
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date.seconds * 1000);
  return d.toLocaleDateString("es-ES"); // Formato DD/MM/YYYY para el idioma español
}

function Row(props) {
  const { row, tiposHora, empleados, obra, ajustes, id, clientes, horas } =
    props;
  const [open, setOpen] = useState(false);

  console.log(row);

  const getNombreEmpleado = (idcliente) => {
    const cliente = empleados.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre + " " + cliente.apellido : "Desconocida";
  };

  const sumarHorasTotales = (details) => {
    let totalHoras = 0;
    details.forEach((detail) => {
      totalHoras += detail.horas;
    });
    return totalHoras;
  };

  const totalVenta = sumarHorasTotales(row.details);

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

  const removeWordHora = (tipoHora) => {
    return tipoHora.replace(/hora/gi, "").trim(); // Eliminamos "hora" independientemente de su ubicación en la cadena y luego quitamos los espacios en blanco adicionales
  };

  function calcularTotalHorasObra(details) {
    return details.reduce((total, registro) => {
      return total + registro.horas * registro.valorHoraVenta;
    }, 0);
  }

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

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "N/A";
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
          {getNombreEmpleado(row.empleadoId)}
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
                      Carga
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Trabajo
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Horas
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Valor Hora
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Valor Venta
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Tipo
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Sub. Costo
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Sub. Venta
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Obra ID
                    </TableCell>
                    <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Cliente
                    </TableCell>
                    {/*   <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                      Acciones
                    </TableCell> */}
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
                        {(
                          Number(detail.horas) * Number(detail.valorHora)
                        ).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>
                      {detail.distancia === "corta" ? (
                        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                          {(
                            Number(detail.horas) * Number(detail.valorHoraVenta)
                          ).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </TableCell>
                      ) : (
                        <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                          {(
                            Number(detail.horas) *
                            Number(ajustes.horaVentaDistancia)
                          ).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </TableCell>
                      )}

                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {detail.obraId}
                      </TableCell>
                      <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
                        {getNombrecliente(detail.clienteId)}
                      </TableCell>
                      {/*                       <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }}>
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
                      </TableCell> */}
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

export default function HorasGlobalesPage() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [tiposHora, setTiposHora] = useState([]);
  const { openDrawer } = React.useContext(DrawerContext);
  const { clientes, empleados, horas } = React.useContext(TableContext);
  const [empleado, setEmpleado] = React.useState([]);
  const [ajustes, setAjustes] = useState([]);
  const [obra, setObra] = React.useState([]);
  const [categoriaEmpleado, setCategoriaEmpleado] = useState([]);
  console.log(horas);

  useEffect(() => {
    const fetchHoras = async () => {
      const q = query(collection(db, "horas"), where("empleadoId", "==", id));
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
          valorHoraVenta: curr.valorHoraVenta,
          tipoHora: curr.tipoHora,
          obraId: curr.obraId,
          clienteId: curr.clienteId,
          distancia: curr.distancia,
        });
        return acc;
      }, {});

      setTiposHora(Array.from(allTiposHora));
      setRows(Object.values(groupedData));
    };

    fetchHoras();
  }, [id]);

  console.log();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "categoriasEmpleados", "valoresHoras");
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
        const empleadoDoc = await getDoc(doc(db, "empleados", id));
        if (empleadoDoc.exists()) {
          setEmpleado(empleadoDoc.data());
          setAjustes(empleadoDoc.data().categoriaEmpleado);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching obra:", error);
      }
    };

    fetchObra();
  }, []);
  /* 
  React.useEffect(() => {
    const fetchObra = async () => {
      try {
        const obraDoc = await getDoc(doc(db, "obras", id));
        if (obraDoc.exists()) {
          setObra(obraDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching obra:", error);
      }
    };

    fetchObra();
  }, []); */

  function formatDate(date) {
    if (!date) return "";
    const d = new Date(date.seconds * 1000);
    return d.toLocaleDateString("es-ES"); // Formato DD/MM/YYYY para el idioma español
  }

  const dateToISODateString = (seconds) => {
    return new Date(seconds * 1000).toISOString().split("T")[0];
  };

  const exportToExcel = () => {
    const data = rows[0].details.map((hora) => {
      const filaPedido = [
        empleado.nombre + " " + empleado.apellido,
        hora.id,
        dateToISODateString(hora.fechaHora.seconds),
        dateToISODateString(hora.fechaCarga.seconds),
        hora.horas,
        hora.valorHora,
        hora.tipoHora,
        hora.obraId,
        hora.clienteId,
        hora.distancia,
      ];
      return filaPedido;
    });

    const header = [
      "Empleado",
      "ID",
      "Fecha Hora",
      "Fecha Carga",
      "Horas",
      "Valor Hora",
      "Tipo Hora",
      "Obra ID",
      "Cliente ID",
      "Distancia",
    ];

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "Horas.xlsx");
  };

  return (
    <div
      style={{
        fontFamily: '"Kanit", sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {empleado && (
        <div style={{ marginLeft: openDrawer ? "16.5rem" : "6.5rem" }}>
          <h6>Empleado ID: #{id || "No disponible"}</h6>

          <p>
            <strong>Fecha Inicio:</strong> {formatDate(empleado.fechaAlta)}
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
        {empleado.nombre + " " + empleado.apellido || "No disponible"}
      </h5>

      <div
        style={{
          marginBottom: "1rem",
          marginLeft: openDrawer ? "16.5rem" : "6.5rem",
        }}
      >
        <Button
          style={{ marginLeft: "1rem", fontFamily: '"Kanit", sans-serif' }}
          variant="outlined"
          color="info"
          onClick={exportToExcel}
        >
          <span
            style={{ marginRight: "0.5rem" }}
            className="material-symbols-outlined"
          >
            download
          </span>
          REPORTE EMPLEADO
        </Button>
      </div>
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
                empleado={empleado}
                id={id}
                obra={obra}
                clientes={clientes}
                horas={horas}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
