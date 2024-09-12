import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ObraDetail({
  idObra,
  cambioHoras,
  setTotalHorasEmpleado,
  setTotalValor,
  totalValor,
}) {
  const [horasPorTipo, setHorasPorTipo] = useState({});

  const isMobile = useMediaQuery("(max-width:760px)");

  const navigate = useNavigate();

  function ccyFormat(num) {
    return num.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  }

  useEffect(() => {
    const consultaObra = async () => {
      try {
        const horaRef = collection(db, "horas");
        const horaSnapshot = await getDocs(horaRef);

        let horasPorTipoLocal = {};

        horaSnapshot.forEach((hora) => {
          if (hora.data().obraId === idObra) {
            const { horas, tipoHora, valorHora } = hora.data();

            if (!horasPorTipoLocal[tipoHora]) {
              horasPorTipoLocal[tipoHora] = {
                totalHoras: 0,
                totalValor: 0,
              };
            }

            if (horas > 0) {
              // Sumar horas y valorHora
              horasPorTipoLocal[tipoHora].totalHoras += horas;
              horasPorTipoLocal[tipoHora].totalValor += horas * valorHora;
            } else {
              // Restar horas y valorHora
              horasPorTipoLocal[tipoHora].totalHoras += horas;
              horasPorTipoLocal[tipoHora].totalValor -= horas * valorHora; // Restar el valor correspondiente
            }
          }
        });

        // Calculando el total general de valor
        let totalValorGeneral = 0;
        Object.values(horasPorTipoLocal).forEach(({ totalValor }) => {
          totalValorGeneral += totalValor;
        });

        setHorasPorTipo(horasPorTipoLocal);
        setTotalValor(totalValorGeneral);

        if (setTotalHorasEmpleado) {
          // Sumar las horas de todos los tipos
          const totalHoras = Object.values(horasPorTipoLocal).reduce(
            (acc, { totalHoras }) => acc + totalHoras,
            0
          );
          setTotalHorasEmpleado(totalHoras);
        }
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
    };

    consultaObra();
  }, [idObra, cambioHoras, setTotalHorasEmpleado]);

  return (
    <TableContainer
      sx={{
        width: isMobile ? "90vw" : "auto",
        marginTop: "1rem",
        marginBottom: "1rem",
        marginRight: "2rem",
      }}
      component={Paper}
    >
      <Table
        sx={{
          width: "100% ",
        }}
        aria-label="spanning table"
      >
        <TableHead sx={{ backgroundColor: "rgba(194, 202, 208, 0.72)" }}>
          <TableRow>
            <TableCell align="left">
              <Tooltip title="Abrir Detalle">
                <Button onClick={() => navigate(`/gastosHorasPage/${idObra}`)}>
                  <span class="material-symbols-outlined">open_in_new</span>
                </Button>
              </Tooltip>
            </TableCell>
            <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="left">
              Horas
            </TableCell>
            <TableCell sx={{ fontFamily: '"Kanit", sans-serif' }} align="left">
              Precio
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(horasPorTipo).map(
            ([tipoHora, { totalHoras, totalValor }]) => (
              <TableRow key={tipoHora}>
                <TableCell
                  sx={{ fontFamily: '"Kanit", sans-serif' }}
                  align="left"
                >
                  {tipoHora}
                </TableCell>
                <TableCell
                  sx={{ fontFamily: '"Kanit", sans-serif' }}
                  align="left"
                >
                  {totalHoras}
                </TableCell>
                <TableCell
                  sx={{ fontFamily: '"Kanit", sans-serif' }}
                  align="left"
                >
                  {ccyFormat(totalValor)}
                </TableCell>
              </TableRow>
            )
          )}
          <TableRow>
            <TableCell
              colSpan={2}
              style={{
                fontWeight: "900",
                fontWeight: 600,
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              TOTAL EMPLEADOS
            </TableCell>
            <TableCell
              align="left"
              style={{
                fontWeight: "900",
                fontWeight: 600,
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              {ccyFormat(totalValor)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
