import * as React from "react";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import {
  TableContext,
  TableContextComponent,
} from "../../../context/TableContext";
import { Button, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ccyFormat(num) {
  return num.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}
function Row(props) {
  const isMobile = useMediaQuery("(max-width:760px)");
  const { nombrePropiedad, valorPropiedad, getNombreCategoria } = props;
  const [open, setOpen] = React.useState(false);
  const [gastoData, setGastoData] = React.useState(null);
  const [totalImporte, setTotalImporte] = React.useState(0);
  const { proveedores, clientes, obras } = React.useContext(TableContext);

  React.useEffect(() => {
    const consultaGastos = async () => {
      try {
        let totalImporte = 0; // Variable para almacenar la suma de los importes
        const gastosData = {}; // Objeto para almacenar los datos de los gastos

        for (const id of Object.keys(valorPropiedad)) {
          const reffGasto = doc(db, "gastos", valorPropiedad[id]);
          const docGasto = await getDoc(reffGasto);
          const gasto = docGasto.data();

          // Agregar el gasto al objeto de datos de gastos
          gastosData[id] = gasto;

          // Sumar el importe al total
          totalImporte += gasto.montoTotal || 0;
        }

        // Establecer el estado con el objeto de datos de gastos y el total del importe
        setGastoData(gastosData);
        setTotalImporte(totalImporte);
      } catch (error) {
        console.error("Error fetching Gastos:", error);
      }
    };

    consultaGastos();
  }, [valorPropiedad]);

  console.log(gastoData);
  console.log(totalImporte);

  const obtenerNombreProveedor = (proveedorId) => {
    // Busca el proveedor con el proveedorId proporcionado
    const proveedor = proveedores.find((prov) => prov.id === proveedorId);

    // Si se encuentra el proveedor, devuelve su nombre, de lo contrario, devuelve un valor por defecto
    return proveedor ? proveedor.nombreComercio : "Proveedor no encontrado";
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
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
          style={{
            fontSize: "90%",
            fontFamily: '"Kanit", sans-serif',
          }}
          component="th"
          scope="row"
          color="white"
        >
          {getNombreCategoria(nombrePropiedad)}
        </TableCell>
        <TableCell
          style={{
            fontSize: "90%",
            fontFamily: '"Kanit", sans-serif',
          }}
          align="right"
        >
          {ccyFormat(totalImporte)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead
                  sx={{ backgroundColor: "rgba(194, 202, 208, 0.72)" }}
                >
                  <TableRow>
                    <TableCell
                      style={{
                        fontSize: "80%",
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      Fecha
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "80%",
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      Proveedor
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        fontSize: "80%",
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      Total Neto
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        fontSize: "80%",
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      Total Bruto
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gastoData &&
                    Object.keys(gastoData).map((id) => (
                      <TableRow key={id}>
                        <TableCell
                          style={{
                            fontSize: "70%",
                            fontFamily: '"Kanit", sans-serif',
                          }}
                        >
                          {new Date(
                            gastoData[id].fechaGasto.seconds * 1000
                          ).toLocaleDateString()}{" "}
                          {/* Renderiza la fecha en un formato legible */}
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "70%",
                            fontFamily: '"Kanit", sans-serif',
                          }}
                        >
                          {obtenerNombreProveedor(gastoData[id].proveedorId)}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            fontSize: "70%",
                            fontFamily: '"Kanit", sans-serif',
                          }}
                        >
                          {ccyFormat(gastoData[id].importe)}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            fontSize: "70%",
                            fontFamily: '"Kanit", sans-serif',
                          }}
                        >
                          {ccyFormat(gastoData[id].montoTotal)}
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

Row.propTypes = {
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
};

export default function ObrasGastos({ idObra, cambioGastos }) {
  const [gastos, setGastos] = React.useState();
  const isMobile = useMediaQuery("(max-width:760px)");
  const navigate = useNavigate();
  const { categorias } = React.useContext(TableContext);

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  React.useEffect(() => {
    const consultaObra = async () => {
      try {
        const obraRef = doc(db, "obras", idObra); // Referencia a la obra específica
        const obraSnapshot = await getDoc(obraRef);

        if (obraSnapshot.exists()) {
          const gastos = obraSnapshot.data().gastos;

          // Sumar los valores numéricos de las horas del empleado de la obra específica

          setGastos(gastos);
          console.log(gastos);
        } else {
          console.error("No existe la obra con el ID especificado.");
        }
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
    };

    consultaObra();
  }, [idObra, cambioGastos]);

  console.log(gastos);

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: isMobile ? "90vw" : "100%",
        marginTop: "1rem",
        marginBottom: "1rem",
      }}
    >
      <Table aria-label="collapsible table">
        <TableHead sx={{ backgroundColor: "rgba(194, 202, 208, 0.72)" }}>
          <TableRow>
            <TableCell>
              <Tooltip title="Abrir Detalle">
                <Button onClick={() => navigate(`/gastosObraPage/${idObra}`)}>
                  <span class="material-symbols-outlined">open_in_new</span>
                </Button>
              </Tooltip>
            </TableCell>
            <TableCell
              style={{
                fontSize: "90%",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              Categoria
            </TableCell>
            <TableCell
              style={{
                fontSize: "90%",
                fontFamily: '"Kanit", sans-serif',
              }}
              align="right"
            >
              TOTAL
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gastos &&
            Object.entries(gastos).map(([nombre, valor], index) => (
              <Row
                key={nombre}
                nombrePropiedad={nombre}
                valorPropiedad={valor}
                index={index}
                getNombreCategoria={getNombreCategoria}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
