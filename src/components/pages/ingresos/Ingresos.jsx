import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX
import { Tooltip, useMediaQuery } from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import { DrawerContext } from "../../context/DrawerContext";
import IngresoListDetail from "./IngresoListDetail"; // Componente para mostrar detalles de ingresos
import IngresoForm from "./IngresoForm"; // Componente para agregar un nuevo ingreso

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]); // Estado para almacenar la lista de ingresos
  const [openForm, setOpenForm] = useState(false); // Estado para controlar la apertura del formulario de nuevo ingreso
  const [statusDelete, setStatusDelete] = useState(false); // Estado para actualizar la eliminación de ingresos
  const [statusEdit, setStatusEdit] = useState(false); // Estado para actualizar la edición de ingresos
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la paginación
  const [ingresosPerPage] = useState(5); // Cantidad de ingresos por página
  const [filterValue, setFilterValue] = useState(""); // Estado para almacenar el valor del filtro de búsqueda
  const { setOpenDrawer, openDrawer } = useContext(DrawerContext); // Contexto del cajón de la aplicación
  const theme = createTheme({
    // Tema para estilos responsivos
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

  const isMiddleMobile = useMediaQuery(theme.breakpoints.down("lg")); // Verifica si el dispositivo es mediano y móvil

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingresos")); // Obtiene los documentos de la colección "ingresos"
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newArray.push({ ...data, id: doc.id });
        });
        newArray.sort(
          (a, b) => b.fechaIngreso.toDate() - a.fechaIngreso.toDate()
        );
        setIngresos(newArray); // Actualiza el estado con la lista de ingresos
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(); // Llama a la función fetchData al cargar el componente
  }, [statusDelete, openForm, statusEdit]); // Dependencias que activan la carga de datos

  // Calcula los índices del primer y último ingreso en la página actual
  const indexOfLastIngreso = currentPage * ingresosPerPage;
  const indexOfFirstIngreso = indexOfLastIngreso - ingresosPerPage;

  // Filtra los ingresos por el valor del campo de filtro
  const filteredIngresos = ingresos.filter((ingreso) =>
    `${ingreso.descripcion.toLowerCase()}`.includes(filterValue.toLowerCase())
  );

  // Obtiene los ingresos de la página actual
  const currentIngresos = filteredIngresos.slice(
    indexOfFirstIngreso,
    indexOfLastIngreso
  );

  // Cambia de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para exportar la lista de ingresos a Excel
  const exportToExcel = () => {
    const data = ingresos.map((ingreso) => [
      ingreso.cuenta,
      ingreso.descripcion,
      ingreso.fechaIngreso.toDate().toLocaleDateString(), // Convierte la fecha a formato de cadena
      ingreso.monto,
      ingreso.numeroComprobante,
      ingreso.clienteId,
      ingreso.tipoComprobante,
    ]);

    const header = [
      "Cuenta",
      "Descripción",
      "Fecha de Ingreso",
      "Monto",
      "Número de Comprobante",
      "ID del Cliente",
      "Tipo de Comprobante",
    ];

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos"); // Nombre de la hoja de cálculo
    XLSX.writeFile(wb, "Ingresos.xlsx"); // Nombre del archivo de Excel
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
        fontSize: "2rem",
        position: "relative",
        width: openDrawer ? "80%" : "90%",
        marginLeft: openDrawer ? "16.5rem" : "6rem",
        marginRight: "20vw",
      }}
    >
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
            onClick={() => setOpenForm(true)}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              post_add
            </span>
            Nuevo Ingreso
          </Button>
        </div>
        <h6 style={{ fontFamily: '"Kanit", sans-serif', fontWeight: "300" }}>
          Buscar por Descripcion...
        </h6>
        {/* Campo de filtro */}
        <TextField
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
                    className="material-symbols-outlined"
                  >
                    manage_search
                  </span>
                </div>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <div style={{ width: "100%" }}>
        {!openForm ? (
          <IngresoListDetail
            ingresos={currentIngresos}
            setStatusDelete={setStatusDelete}
            statusDelete={statusDelete}
            setOpenForm={setOpenForm}
            setStatusEdit={setStatusEdit}
            statusEdit={statusEdit}
          />
        ) : (
          <IngresoForm
            ingresos={ingresos}
            setOpenForm={setOpenForm}
            openForm={openForm}
          />
        )}
      </div>
      <Box
        mt={2}
        style={{ display: "flex", justifyContent: "center", width: "100%" }}
      >
        {/* Botones de paginación */}
        <Button
          variant="contained"
          color="inherit"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
          style={{ margin: "1rem" }}
        >
          <span className="material-symbols-outlined">navigate_before</span>
        </Button>
        <Button
          variant="contained"
          onClick={() => paginate(currentPage + 1)}
          style={{ margin: "1rem" }}
        >
          <span className="material-symbols-outlined">navigate_next</span>
        </Button>
      </Box>
    </div>
  );
};

export default Ingresos;
