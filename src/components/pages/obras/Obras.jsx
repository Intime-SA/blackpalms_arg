import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import {
  Alert,
  AlertTitle,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { db } from "../../../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import FormattedDate from "./fechas/FormattedDate";
import ClienteName from "./clientes/ClienteName";
import HorasAcumuladas from "./horas/HorasAcumuladas";
import GastosAcumulados from "./gastos/GastosAcumulados";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import { DrawerContext } from "../../context/DrawerContext";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX
import { TableContext } from "../../context/TableContext";
import ModalObra from "./ModalObra";

function createData(
  id,
  name,
  calories,
  fat,
  carbs,
  protein,
  status,
  montoActual,
  accions
) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
    status,
    montoActual,
    accions,
  };
}

const estadoRender = (estado) => {
  if (estado === "enProceso") {
    return (
      <Alert
        sx={{
          fontFamily: '"Kanit", sans-serif',
          width: "300px",
        }}
        size="small"
        variant="filled"
        severity="info"
      >
        En Proceso
      </Alert>
    );
  } else if (estado === "pausado") {
    return (
      <Alert
        sx={{
          fontFamily: '"Kanit", sans-serif',
          width: "300px",
        }}
        variant="filled"
        severity="warning"
      >
        En Pausa
      </Alert>
    );
  } else if (estado === "cancelado") {
    return (
      <Alert
        sx={{
          fontFamily: '"Kanit", sans-serif',
          width: "300px",
        }}
        variant="filled"
        severity="error"
      >
        Cancelada
        {/* <strong>El pedido fue entregado con exito</strong> */}
      </Alert>
    );
  } else if (estado === "finalizado") {
    return (
      <Alert
        sx={{
          fontFamily: '"Kanit", sans-serif',
          width: "300px",
        }}
        variant="filled"
        severity="success"
      >
        Finalizada
      </Alert>
    );
  } else if (estado === "Archivada") {
    return (
      <Alert variant="contained" color="info">
        <AlertTitle>Archivada</AlertTitle>
      </Alert>
    );
  }
};

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "",
  },
  {
    id: "fecha",
    numeric: false,
    disablePadding: true,
    label: "Fecha Inicio",
  },
  {
    id: "cliente",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "horas",
    numeric: true,
    disablePadding: false,
    label: "Horas",
  },
  {
    id: "gastos",
    numeric: true,
    disablePadding: false,
    label: "Gastos",
  },
  {
    id: "lugar",
    numeric: false,
    disablePadding: false,
    label: "Lugar",
  },
  {
    id: "montoActual",
    numeric: true,
    disablePadding: false,
    label: "Presupuesto Inicial",
  },

  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "accions",
    numeric: true,
    disablePadding: false,
    label: "Acciones",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead style={{ backgroundColor: "#121621", color: "white" }}>
      <TableRow style={{ backgroundColor: "#121621", color: "white" }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              backgroundColor: "#121621",
              color: "white",
              width:
                headCell.id === "horas" ||
                headCell.id === "status" ||
                headCell.id === "acciones"
                  ? "10%"
                  : "30%", // Ajusta los porcentajes según tus necesidades
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                fontFamily: '"Kanit", sans-serif',

                color: "white",
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%", color: "white" }}
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}
      <FilterListIcon />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Obras() {
  const [obras, setObras] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openForm, setOpenForm] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1); // Página actual
  const [obrasPerPage] = React.useState(5);
  const [filterValue, setFilterValue] = React.useState("");
  const [openModalObra, setOpenModalObra] = React.useState(false);

  const [arrayObras, setArrayObras] = React.useState([]);
  const [actualizarObras, setActualizarObras] = React.useState(false);

  const { openDrawer } = React.useContext(DrawerContext);
  const { clientes } = React.useContext(TableContext);

  React.useEffect(() => {
    let refCollection = collection(db, "obras");
    getDocs(refCollection)
      .then((querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          newArray.push({ ...userData, id: doc.id });
        });
        setObras(newArray);
      })
      .catch((err) => console.log(err));
  }, []);

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "Desconocida";
  };

  const formatDate = (firestoreTimestamp) => {
    const date = new Date(
      firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1000000
    );
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const exportToExcel = () => {
    const data = obras.map((obra) => {
      const filaPedido = [
        getNombrecliente(obra.cliente),
        obra.descripcion,
        obra.estado,
        formatDate(obra.fechaInicio),
        obra.presupuestoInicial,
        obra.lugar,
      ];
      return filaPedido;
    });

    const header = [
      "cliente",
      "descripcion",
      "estado",
      "fechaInicio",
      "presupuestoInicial",
      "lugar",
    ];

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MiHojaDeCalculo");
    XLSX.writeFile(wb, "Obras.xlsx");
  };

  // Calcular índices del primer y último cliente en la página actual
  const indexOfLastobra = currentPage * obrasPerPage;
  const indexOfFirstobra = indexOfLastobra - obrasPerPage;

  // Filtrar los clientes por el valor del campo de filtro
  const filteredobras = obras.filter((obra) =>
    `${obra.cliente.toLowerCase()}`.includes(filterValue.toLowerCase())
  );

  const currentobras = filteredobras.slice(indexOfFirstobra, indexOfLastobra);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  React.useEffect(() => {
    const consultaObras = async () => {
      try {
        const collectionObras = collection(db, "obras");
        const obrasSnapshot = await getDocs(collectionObras);
        const obrasData = obrasSnapshot.docs.map((obra) => ({
          id: obra.id,
          ...obra.data(),
        }));
        setArrayObras(obrasData);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    consultaObras();
  }, [actualizarObras]);

  console.log(arrayObras);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const navigate = useNavigate();

  const [idMenuBotton, setIdMenuBotton] = React.useState("");

  const handleClick = (id) => {
    setIdMenuBotton(id);
    setOpen(!open);
    setOpen2(!open2);
  };

  const handleClick2 = (id) => {
    setIdMenuBotton(id);
    setOpen2(!open2);
  };

  const handleClickSelect = (id) => {
    console.log(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const FormattedDate = ({ timestamp }) => {
    // Convertir segundos y nanosegundos a milisegundos totales
    const totalMilliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;

    // Crear un objeto de fecha con el total de milisegundos
    const date = new Date(totalMilliseconds);

    // Formatear la fecha a DD/MM/YYYY
    const formattedDate = date.toLocaleDateString("en-GB"); // 'en-GB' formatea la fecha como DD/MM/YYYY

    return <div>{formattedDate}</div>;
  };

  console.log(arrayObras);

  const formattedGastos = (total) => {
    return total.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  };

  const handlePausar = async () => {
    console.log("obra de pausar :" + idMenuBotton);
    try {
      if (idMenuBotton) {
        // Lógica adicional para finalizar la obra
        // Por ejemplo, actualizar algún campo en el documento de obra
        await updateDoc(doc(db, "obras", idMenuBotton), {
          estado: "pausado", // Asegúrate de ajustar el campo y valor según tu esquema
          fechaFinalizacion: serverTimestamp(), // Ejemplo de agregar la fecha de finalización
        });
        console.log("Obra Pausada con éxito");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al finalizar la obra:", error);
    }
  };

  const handleActivar = async () => {
    console.log("obra de pausar :" + idMenuBotton);
    try {
      if (idMenuBotton) {
        // Lógica adicional para finalizar la obra
        // Por ejemplo, actualizar algún campo en el documento de obra
        await updateDoc(doc(db, "obras", idMenuBotton), {
          estado: "enProceso", // Asegúrate de ajustar el campo y valor según tu esquema
          fechaFinalizacion: serverTimestamp(), // Ejemplo de agregar la fecha de finalización
        });
        console.log("Obra Activada con éxito");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al finalizar la obra:", error);
    }
  };

  const handleCancelar = async () => {
    console.log("obra de pausar :" + idMenuBotton);
    try {
      if (idMenuBotton) {
        // Lógica adicional para finalizar la obra
        // Por ejemplo, actualizar algún campo en el documento de obra
        await updateDoc(doc(db, "obras", idMenuBotton), {
          estado: "cancelado", // Asegúrate de ajustar el campo y valor según tu esquema
          fechaFinalizacion: serverTimestamp(), // Ejemplo de agregar la fecha de finalización
        });
        console.log("Obra Activada con éxito");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al finalizar la obra:", error);
    }
  };

  const handleFinalizar = async () => {
    console.log("obra de pausar :" + idMenuBotton);
    try {
      if (idMenuBotton) {
        // Lógica adicional para finalizar la obra
        // Por ejemplo, actualizar algún campo en el documento de obra
        await updateDoc(doc(db, "obras", idMenuBotton), {
          estado: "finalizado", // Asegúrate de ajustar el campo y valor según tu esquema
          fechaFinalizacion: serverTimestamp(), // Ejemplo de agregar la fecha de finalización
        });
        console.log("Obra Finalizada con éxito");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al finalizar la obra:", error);
    }
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 800, // Define md como 800px
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Box
      sx={{
        width: openDrawer ? "80%" : "90%",
        marginLeft: openDrawer ? "16.5rem" : "6rem",
      }}
    >
      <ModalObra
        openModalObra={openModalObra}
        setOpenModalObra={setOpenModalObra}
        setActualizarObras={setActualizarObras}
      />
      <Box>
        <div style={{ marginBottom: "1rem" }}>
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
            Exportar Lista
          </Button>
          <Button
            style={{ marginLeft: "1rem", fontFamily: '"Kanit", sans-serif' }}
            variant="contained"
            color="info"
            onClick={() => setOpenModalObra(true)}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              class="material-symbols-outlined"
            >
              new_window
            </span>
            Nueva Obra
          </Button>
        </div>
        {/* Campo de filtro */}
      </Box>
      {/*       <TextField
        label=""
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        variant="outlined"
        style={{ marginLeft: "10px", padding: "5px", marginBottom: "0.5rem" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <div
                style={{
                  width: "10rem",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{ fontSize: "150%" }}
                  class="material-symbols-outlined"
                >
                  manage_search
                </span>
              </div>
            </InputAdornment>
          ),
        }}
      /> */}
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {arrayObras.map((row) => {
                return (
                  <TableRow
                    hover
                    onClick={() => navigate(`/obra/${row.id}`)}
                    role="checkbox"
                    key={row.id}
                    sx={{ cursor: "pointer", position: "relative" }}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        zIndex: 1,
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      <Checkbox
                        onClick={(event) => {
                          event.stopPropagation(); // Evita que el onClick del TableRow se dispare
                          handleClickSelect(row.id);
                        }}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      <FormattedDate timestamp={row.fechaInicio} />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                      align="right"
                    >
                      <ClienteName clienteId={row.cliente}></ClienteName>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      <HorasAcumuladas horasEmpleado={row.horasEmpleado} />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                    >
                      <GastosAcumulados obraId={row.id} />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                      align="left"
                    >
                      {row.lugar}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                      align="right"
                    >
                      {formattedGastos(row.presupuestoInicial)}
                    </TableCell>

                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                      align="center"
                    >
                      {estadoRender(row.estado)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: '"Kanit", sans-serif',
                      }}
                      align="right"
                    >
                      <div style={{ zIndex: 0 }}>
                        {row.estado === "enProceso" && (
                          <div>
                            <Button
                              id="demo-positioned-button"
                              aria-controls={
                                open ? "demo-positioned-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              sx={{
                                zIndex: 1,
                                fontFamily: '"Kanit", sans-serif',
                                fontSize: "120%",
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleClick(row.id);
                              }}
                            >
                              <span className="material-symbols-outlined">
                                more_vert
                              </span>
                            </Button>

                            <Menu
                              id="demo-positioned-menu"
                              open={open}
                              onClose={handleClose} // Cierra el menú cuando se selecciona una opción o se hace clic fuera del menú
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                            >
                              <MenuItem
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleFinalizar();
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  className="material-symbols-outlined"
                                >
                                  check_circle
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>
                                  Finalizar
                                </h6>
                              </MenuItem>
                              {row.estado === "enProceso" && (
                                <div>
                                  <MenuItem
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handlePausar();
                                    }}
                                  >
                                    <span
                                      style={{ margin: "1rem" }}
                                      className="material-symbols-outlined"
                                    >
                                      pause_circle
                                    </span>
                                    <h6 style={{ marginTop: "0.5rem" }}>
                                      Pausar
                                    </h6>
                                  </MenuItem>
                                  <MenuItem
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleCancelar();
                                    }}
                                  >
                                    <span
                                      style={{ margin: "1rem" }}
                                      class="material-symbols-outlined"
                                    >
                                      block
                                    </span>
                                    <h6 style={{ marginTop: "0.5rem" }}>
                                      Cancelar
                                    </h6>
                                  </MenuItem>
                                </div>
                              )}
                              {row.estado === "pausado" && (
                                <MenuItem
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleActivar();
                                  }}
                                >
                                  <span
                                    style={{ margin: "1rem" }}
                                    className="material-symbols-outlined"
                                  >
                                    pause_circle
                                  </span>
                                  <h6 style={{ marginTop: "0.5rem" }}>
                                    Activar
                                  </h6>
                                </MenuItem>
                              )}
                            </Menu>
                          </div>
                        )}
                        {row.estado === "pausado" && (
                          <div>
                            <Button
                              id="demo-button"
                              aria-controls={
                                open ? "demo-positioned-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              sx={{
                                zIndex: 1,
                                fontFamily: '"Kanit", sans-serif',
                                fontSize: "120%",
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleClick2(row.id);
                              }}
                            >
                              <span className="material-symbols-outlined">
                                more_vert
                              </span>
                            </Button>

                            <Menu
                              id="demo-menu"
                              open={open2}
                              onClose={handleClose} // Cierra el menú cuando se selecciona una opción o se hace clic fuera del menú
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                            >
                              <MenuItem
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCancelar();
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  className="material-symbols-outlined"
                                >
                                  pause_circle
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>
                                  Cancelar
                                </h6>
                              </MenuItem>

                              <MenuItem
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleActivar();
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  class="material-symbols-outlined"
                                >
                                  arrow_circle_up
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>Activar</h6>
                              </MenuItem>
                            </Menu>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
