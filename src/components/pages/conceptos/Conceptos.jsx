import React, { useContext, useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, InputAdornment, TextField } from "@mui/material";
import * as XLSX from "xlsx"; // Importa la biblioteca XLSX
import { Tooltip, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DrawerContext } from "../../context/DrawerContext";
import ConceptosForm from "./ConceptosForm";
import ConceptosListDetail from "./ConceptosListDetail";
import SubConceptosForm from "./SubConceptoForm";

const Conceptos = () => {
  const [concepts, setConcepts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openForm2, setOpenForm2] = useState(false);
  const [statusDelete, setStatusDelete] = useState(false);
  const [statusEdit, setStatusEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [conceptsPerPage] = useState(10); // Cantidad de conceptos por página
  const [totalConcepts, setTotalConcepts] = useState();
  const [filterValue, setFilterValue] = useState(""); // Estado para almacenar el valor del filtro

  const { setOpenDrawer, openDrawer } = useContext(DrawerContext);

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

  useEffect(() => {
    let refCollection = collection(db, "conceptos");
    getDocs(refCollection)
      .then((querySnapshot) => {
        let newArray = [];
        querySnapshot.forEach((doc) => {
          const conceptData = doc.data();
          newArray.push({ ...conceptData, id: doc.id });
        });
        setConcepts(newArray);
      })
      .catch((err) => console.log(err));
  }, [statusDelete, openForm, statusEdit]);

  useEffect(() => {
    if (concepts) {
      setTotalConcepts(concepts.length);
    }
  }, [concepts]);

  const exportToExcel = () => {
    const data = concepts.map((concept) => {
      const filaConcepto = [concept.descripcion, concept.nombre];
      return filaConcepto;
    });

    console.log(concepts);

    const header = ["Descripción", "Nombre"];

    const wsData = [header, ...data];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conceptos");
    XLSX.writeFile(wb, "Conceptos.xlsx");
  };

  const indexOfLastConcept = currentPage * conceptsPerPage;
  const indexOfFirstConcept = indexOfLastConcept - conceptsPerPage;

  const filteredConcepts = concepts.filter((concept) =>
    `${concept.nombre.toLowerCase()}`.includes(filterValue.toLowerCase())
  );

  const currentConcepts = filteredConcepts.slice(
    indexOfFirstConcept,
    indexOfLastConcept
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNewConcept = () => {
    setOpenForm2(true);
    setOpenForm(false);
  };

  const handleNewSubConcept = () => {
    setOpenForm(true);
    setOpenForm2(false);
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
        width: isMiddleMobile ? "90%" : "80%",
        width: openDrawer ? "80%" : "90%",
        marginLeft: isMiddleMobile ? "5rem" : "16.5rem",
        marginLeft: !openDrawer ? "6rem" : "16.5rem",
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
            onClick={handleNewConcept}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              add_comment
            </span>
            Nuevo Concepto
          </Button>
          <Button
            style={{ marginLeft: "1rem", fontFamily: '"Kanit", sans-serif' }}
            variant="filled"
            color="info"
            onClick={handleNewSubConcept}
          >
            <span
              style={{ marginRight: "0.5rem" }}
              className="material-symbols-outlined"
            >
              docs_add_on
            </span>
            Nuevo Sub-Concepto
          </Button>
        </div>
      </Box>

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
      <div style={{ width: "100%" }}>
        {!openForm && !openForm2 ? (
          <ConceptosListDetail
            concepts={currentConcepts}
            setStatusDelete={setStatusDelete}
            statusDelete={statusDelete}
            setOpenForm={setOpenForm}
            setStatusEdit={setStatusEdit}
            statusEdit={statusEdit}
          />
        ) : openForm && !openForm2 ? (
          <ConceptosForm
            concepts={concepts}
            setOpenForm={setOpenForm}
            openForm={openForm}
          />
        ) : (
          openForm2 && (
            <SubConceptosForm
              concepts={concepts}
              setOpenForm={setOpenForm}
              openForm={openForm}
            />
          )
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

export default Conceptos;
