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
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Box, Button, Tooltip } from "@mui/material";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX
import ModalComponentGasto from "../obra/actions/ModalComponentGasto";
import ModalComponentGastoGlobal from "../obra/actions/ModalComponentGastoGlobal";

export default function Compras() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { proveedores, clientes, categorias, gastos } =
    React.useContext(TableContext); // Agregado proveedores al contexto
  const { id } = useParams(); // Obtener el parámetro "id" de la URL

  const [anchorEl, setAnchorEl] = React.useState(null); // Estado para el elemento anclado
  const [selectedGasto, setSelectedGasto] = React.useState(null); // Estado para el gasto seleccionado
  const [currentPage, setCurrentPage] = React.useState(1); // Página actual
  const [customersPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(true);
  const [openModalGasto, setOpenModalGasto] = React.useState(false);

  const { openDrawer } = React.useContext(DrawerContext);

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  const getNombreSubCategoria = (idCategoria, idSubCategoria) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);

    if (categoria && categoria.subcategorias) {
      const subCategoria = categoria.subcategorias[idSubCategoria];

      return subCategoria ? subCategoria.nombre : "Desconocida";
    } else {
      return "Desconocida";
    }
  };

  console.log(gastos);

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
    { id: "tipoComprobante", label: "T. Comprobante", minWidth: 100 },
    { id: "numeroComprobante", label: "N° Comprobante", minWidth: 150 },
    { id: "proveedorId", label: "Proveedor", minWidth: 100 },
    { id: "clienteId", label: "Cliente", minWidth: 150 },
    { id: "montoTotal", label: "Monto Total", minWidth: 100 },
    { id: "gastoObra", label: "Gasto Obra", minWidth: 100 },
    { id: "gastoGlobal", label: "Gasto Global", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50, align: "center" },
  ];

  const renderProveedorNombre = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombreComercio : "N/A";
  };

  const getNombrecliente = (idcliente) => {
    const cliente = clientes.find((cat) => cat.id === idcliente);
    return cliente ? cliente.nombre : "N/A";
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

  const exportToExcel = () => {
    // Obtener todos los tipos de impuestos presentes en los gastos
    const allImpuestos = gastos.reduce((types, gasto) => {
      gasto.impuestos.forEach((impuesto) => {
        if (!types.includes(impuesto.tipoImpuesto)) {
          types.push(impuesto.tipoImpuesto);
        }
      });
      return types;
    }, []);

    let header = [
      "Fecha Carga",
      "Fecha Gasto",
      "Tipo Comprobante",
      "Numero Comprobante",
      "Categoria",
      "Obra ID",
      "Subcategoria",
      "Cliente ID",
      "Numero Punto Venta",
      "Proveedor ID",
      "Gasto Obra",
      "Gasto Global",
      "ID",
      "Descripcion",
      "Monto Total",
      "Importe Neto",
    ];

    // Agregar los tipos de impuestos como encabezados adicionales
    header = header.concat(allImpuestos);

    const data = gastos.map((gasto) => {
      const filaPedido = [
        new Date(gasto.fechaCarga.seconds * 1000).toLocaleString(),
        new Date(gasto.fechaGasto.seconds * 1000).toLocaleString(),
        gasto.tipoComprobante,
        gasto.numeroComprobante,
        getNombreCategoria(gasto.categoria),
        gasto.obraId,
        getNombreSubCategoria(gasto.categoria, gasto.subcategoria),
        getNombrecliente(gasto.clienteId),

        gasto.numeroPuntoVenta,
        renderProveedorNombre(gasto.proveedorId),

        gasto.gastoObra,
        gasto.gastoGlobal,
        gasto.id,
        gasto.descripcion,
        gasto.montoTotal,
        gasto.importe,
      ];

      allImpuestos.forEach((tipoImpuesto) => {
        const impuesto = gasto.impuestos.find(
          (i) => i.tipoImpuesto === tipoImpuesto
        );
        filaPedido.push(impuesto ? impuesto.monto : "");
      });

      return filaPedido;
    });

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    XLSX.writeFile(wb, "Gastos.xlsx");
  };

  // Calcular índices del primer y último cliente en la página actual
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  // Filtrar los clientes por el valor del campo de filtro

  const currentCustomers = gastos.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [sortedGastos, setSortedGastos] = React.useState([]);

  const [statusDelete, setStatusDelete] = React.useState(false); // Estado para actualizar la eliminación de egresos
  React.useEffect(() => {
    // Clonamos los gastos para no mutar el estado original
    const sortedGastos = [...gastos];

    // Ordenar newArray de más reciente a más antiguo basado en la fecha
    sortedGastos.sort((a, b) => b.fechaGasto.toDate() - a.fechaGasto.toDate());

    // Aquí puedes hacer algo con los gastos ordenados, como establecerlos en un estado local
    console.log("Gastos ordenados:", sortedGastos);
    setSortedGastos(sortedGastos);
  }, [gastos, statusDelete]);

  const deleteCompras = async (id) => {
    try {
      await deleteDoc(doc(db, "gastos", id));
      setStatusDelete(!statusDelete);
      console.log(`Compra ${id} eliminado correctamente.`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting compra: ", error);
    }
  };

  return (
    <div
      style={{
        marginLeft: openDrawer ? "20rem" : "6rem",
        fontFamily: '"Kanit", sans-serif',
      }}
    >
      <Box>
        {openModalGasto && (
          <ModalComponentGastoGlobal
            openModalGasto={openModalGasto}
            setOpenModalGasto={setOpenModalGasto}
          />
        )}

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
            onClick={() => setOpenModalGasto(true)}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              person_add
            </span>
            Nuevo Gasto Global
          </Button>
        </div>
        {/* Campo de filtro */}
      </Box>
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
              {sortedGastos
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
                      if (column.id === "clienteId") {
                        value = getNombrecliente(value);
                      }
                      if (column.id === "gastoObra") {
                        if (value === true) {
                          let idObra = gasto.obraId;
                          value = (
                            <Tooltip title={`Obra ID: #${idObra}`}>
                              <div>
                                <span
                                  style={{ marginLeft: "2rem", color: "green" }}
                                  class="material-symbols-outlined"
                                >
                                  check_circle
                                </span>
                              </div>
                            </Tooltip>
                          );
                        } else {
                          value = (
                            <span
                              style={{ marginLeft: "2rem", color: "red" }}
                              class="material-symbols-outlined"
                            >
                              cancel
                            </span>
                          );
                        }
                      }
                      if (column.id === "gastoGlobal") {
                        if (value === true) {
                          value = (
                            <span
                              style={{ marginLeft: "2rem", color: "green" }}
                              class="material-symbols-outlined"
                            >
                              check_circle
                            </span>
                          );
                        } else {
                          value = (
                            <span
                              style={{ marginLeft: "2rem", color: "red" }}
                              class="material-symbols-outlined"
                            >
                              cancel
                            </span>
                          );
                        }
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
                      if (column.id === "acciones") {
                        value = (
                          <div style={{ zIndex: 0 }}>
                            <Button
                              aria-label="more"
                              aria-controls="demo-positioned-menu"
                              aria-haspopup="true"
                              onClick={() => deleteCompras(gasto.id)}
                            >
                              <span
                                style={{ margin: "1rem" }}
                                className="material-symbols-outlined"
                              >
                                delete
                              </span>
                            </Button>
                          </div>
                        );
                      }
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
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
