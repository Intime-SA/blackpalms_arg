import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TableContext } from "../../context/TableContext";
import { useParams } from "react-router-dom";
import { DrawerContext } from "../../context/DrawerContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function GastosObraPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { gastos, proveedores, clientes, categorias } =
    React.useContext(TableContext); // Agregado proveedores al contexto
  const { id } = useParams(); // Obtener el parámetro "id" de la URL

  const [gastosFiltrados, setGastosFiltrados] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null); // Estado para el elemento anclado
  const [selectedGasto, setSelectedGasto] = React.useState(null); // Estado para el gasto seleccionado

  const [obra, setObra] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const { openDrawer } = React.useContext(DrawerContext);

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  React.useEffect(() => {
    if (gastos && id) {
      const gastosConId = gastos.filter((gasto) => gasto.obraId === id);
      setGastosFiltrados(gastosConId);
    }
  }, [gastos, id]);

  React.useEffect(() => {
    const fetchObra = async () => {
      try {
        const obraDoc = doc(db, "obras", id);
        const obraSnapshot = await getDoc(obraDoc);
        if (obraSnapshot.exists()) {
          setObra(obraSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchObra();
  }, []);
  console.log(obra);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, gasto) => {
    setAnchorEl(event.currentTarget);
    setSelectedGasto(gasto);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedGasto(null);
  };

  const columns = [
    { id: "fechaGasto", label: "Fecha Comprobante", minWidth: 150 },
    { id: "categoria", label: "Categoría", minWidth: 100 },
    { id: "tipoComprobante", label: "Tipo de Comprobante", minWidth: 100 },
    { id: "numeroComprobante", label: "Número de Comprobante", minWidth: 150 },
    { id: "proveedorId", label: "Proveedor", minWidth: 100 },
    { id: "descripcion", label: "Descripción", minWidth: 150 },
    { id: "montoTotal", label: "Monto Total", minWidth: 100 },
    /*     { id: "acciones", label: "Acciones", minWidth: 50, align: "center" }, */
  ];

  const renderProveedorNombre = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombreComercio : "N/A";
  };

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "Desconocida";
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

  return (
    <div
      style={{
        marginLeft: openDrawer ? "20rem" : "6rem",
        fontFamily: '"Kanit", sans-serif',
      }}
    >
      {obra && (
        <div style={{ margin: "1rem" }}>
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
          }}
        >
          {getNombrecliente(obra.cliente)} > {obra.descripcion}
        </h5>
      </div>

      <Paper sx={{ width: "95%" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ backgroundColor: "#121621" }}>
              <TableRow style={{ backgroundColor: "#121621" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    style={{
                      backgroundColor: "#121621",
                      minWidth: column.minWidth,
                      color: "white",
                      fontFamily: '"Kanit", sans-serif',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {gastosFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((gasto) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={gasto.id}>
                    {columns.map((column) => {
                      let value = gasto[column.id];
                      // Formatear las fechas si es necesario
                      if (column.id === "fechaGasto") {
                        value = new Date(
                          value.seconds * 1000
                        ).toLocaleDateString();
                      }
                      // Reemplazar proveedorId por el nombre del proveedor
                      if (column.id === "proveedorId") {
                        value = renderProveedorNombre(value);
                      }

                      // Formatear números como moneda
                      if (
                        column.id === "importe" ||
                        column.id === "montoTotal"
                      ) {
                        value = value.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        });
                      }
                      // Renderizar el ícono de acciones
                      /*  if (column.id === "acciones") {
                        value = (
                          <div style={{ zIndex: 0 }}>
                            <IconButton
                              aria-label="more"
                              aria-controls="demo-positioned-menu"
                              aria-haspopup="true"
                              onClick={(event) => handleMenuClick(event, gasto)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="demo-positioned-menu"
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
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
                                  fontFamily: '"Kanit", sans-serif',
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  className="material-symbols-outlined"
                                >
                                  search
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>Ver</h6>
                              </MenuItem>
                              <MenuItem
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  fontFamily: '"Kanit", sans-serif',
                                }}
                              >
                                <span
                                  style={{ margin: "1rem" }}
                                  className="material-symbols-outlined"
                                >
                                  delete
                                </span>
                                <h6 style={{ marginTop: "0.5rem" }}>
                                  Eliminar
                                </h6>
                              </MenuItem>
                            </Menu>
                          </div>
                        );
                      } */
                      // Aplicar la función getNombreCategoria si la columna es "categoria"
                      if (column.id === "categoria") {
                        value = getNombreCategoria(value);
                      }
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          style={{ fontFamily: '"Kanit", sans-serif' }}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 25, 100]}
          component="div"
          count={gastosFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
