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
import { Box, Button, Tooltip } from "@mui/material";
import * as XLSX from "xlsx";
import ModalComponentVenta from "./ModalComponentGastoVenta";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function Ventas() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { proveedores, clientes, categorias, ventas } =
    React.useContext(TableContext);
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedVenta, setSelectedVenta] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [customersPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(true);
  const [openModalVenta, setOpenModalVenta] = React.useState(false);
  const [sortedGastos, setSortedGastos] = React.useState([]);

  const { openDrawer } = React.useContext(DrawerContext);

  React.useEffect(() => {
    // Clonamos los gastos para no mutar el estado original
    const sortedGastos = [...ventas];

    // Ordenar newArray de más reciente a más antiguo basado en la fecha
    sortedGastos.sort((a, b) => b.fechaVenta.toDate() - a.fechaVenta.toDate());

    // Aquí puedes hacer algo con los gastos ordenados, como establecerlos en un estado local
    console.log("Gastos ordenados:", sortedGastos);
    setSortedGastos(sortedGastos);
  }, [ventas]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, venta) => {
    setAnchorEl(event.currentTarget);
    setSelectedVenta(venta);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedVenta(null);
  };

  const columns = [
    { id: "fechaVenta", label: "Fecha Comprobante", minWidth: 150 },
    { id: "concepto", label: "Concepto", minWidth: 100 },
    { id: "tipoComprobante", label: "T. Comprobante", minWidth: 100 },
    { id: "numeroComprobante", label: "N° Comprobante", minWidth: 150 },
    { id: "clienteId", label: "Cliente", minWidth: 150 },
    { id: "montoTotal", label: "Monto Total", minWidth: 100 },
    { id: "impuestos", label: "Impuestos", minWidth: 100 },
    { id: "acciones", label: "Acciones", minWidth: 50, align: "center" },
  ];

  const renderProveedorNombre = (proveedorId) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor ? proveedor.nombreComercio : "N/A";
  };

  const renderClienteNombre = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : "N/A";
  };

  const formatDate = (firestoreTimestamp) => {
    if (!firestoreTimestamp) return "No disponible";
    const date = new Date(
      firestoreTimestamp.seconds * 1000 +
        firestoreTimestamp.nanoseconds / 1000000
    );
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToExcel = () => {
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
      "Importe",
      "Impuestos",
    ];

    const data = ventas.map((venta) => {
      const totalImpuestos = venta.impuestos.reduce(
        (acc, impuesto) => acc + impuesto.monto,
        0
      );
      const filaVenta = [
        new Date(venta.fechaCarga.seconds * 1000).toLocaleString(),
        new Date(venta.fechaGasto.seconds * 1000).toLocaleString(),
        venta.tipoComprobante,
        venta.numeroComprobante,
        getNombreCategoria(venta.categoria),
        venta.obraId,
        getNombreSubCategoria(venta.categoria, venta.subcategoria),
        renderClienteNombre(venta.clienteId),
        venta.numeroPuntoVenta,
        renderProveedorNombre(venta.proveedorId),
        venta.gastoObra,
        venta.gastoGlobal,
        venta.id,
        venta.descripcion,
        venta.montoTotal,
        venta.importe,
        totalImpuestos,
      ];
      return filaVenta;
    });

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, "Ventas.xlsx");
  };

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  const getMontoTotal = (montoTotal) => {
    return (
      <strong>
        {montoTotal.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })}
      </strong>
    );
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

  const [statusDelete, setStatusDelete] = React.useState(false); // Estado para actualizar la eliminación de egresos

  const deleteVentas = async (id) => {
    try {
      await deleteDoc(doc(db, "ventas", id));
      setStatusDelete(!statusDelete);
      console.log(`Egreso ${id} eliminado correctamente.`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting egreso: ", error);
    }
  };

  const currentVentas = ventas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div
      style={{
        marginLeft: openDrawer ? "20rem" : "6rem",
        fontFamily: '"Kanit", sans-serif',
      }}
    >
      <ModalComponentVenta
        openModalVenta={openModalVenta}
        setOpenModalVenta={setOpenModalVenta}
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
            onClick={() => setOpenModalVenta(true)}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              person_add
            </span>
            Nueva Venta
          </Button>
        </div>
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
              {currentVentas.map((venta) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={venta.id}>
                  {columns.map((column) => {
                    let value = venta[column.id];
                    if (column.id === "fechaVenta") {
                      value = formatDate(value);
                    } else if (column.id === "proveedorId") {
                      value = renderProveedorNombre(value);
                    } else if (column.id === "clienteId") {
                      value = renderClienteNombre(value);
                    } else if (column.id === "montoTotal") {
                      value = getMontoTotal(value);
                    } else if (column.id === "impuestos") {
                      value = venta.impuestos.reduce(
                        (acc, impuesto) => acc + impuesto.monto,
                        0
                      );
                      value = value.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      });
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || "left"}
                        style={{ fontFamily: '"Kanit", sans-serif' }}
                      >
                        {column.id === "acciones" ? (
                          <>
                            <Tooltip title="Más acciones">
                              <Button
                                onClick={() => deleteVentas(venta.id)}
                                size="small"
                              >
                                <span
                                  className="material-symbols-outlined"
                                  style={{ marginRight: "0.5rem" }}
                                >
                                  delete
                                </span>
                              </Button>
                            </Tooltip>
                          </>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={ventas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
