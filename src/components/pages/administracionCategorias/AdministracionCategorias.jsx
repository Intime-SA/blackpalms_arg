import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import FormularioCategoria from "./FormularioCategoria"; // Asegúrate de que la ruta sea correcta
import { Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TableContext } from "../../context/TableContext";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AdministracionCategoria() {
  const [value, setValue] = React.useState(0);
  const [openForm, setOpenForm] = React.useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = React.useState("");

  const { categoriasEmpleado } = React.useContext(TableContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setOpenForm(false);
  };

  const handleEditValues = (categoriaId) => {
    setSelectedCategoriaId(categoriaId);
    setOpenForm(true);
  };

  const navigate = useNavigate();

  const formatCurrency = (value) => {
    const stringValue = String(value);
    return parseFloat(stringValue).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  };

  return (
    <Box sx={{ width: "80%", marginLeft: "16.5rem" }}>
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button
          color="success"
          variant="contained"
          onClick={() => navigate("/formularioCategoria")}
          sx={{ mt: 2, fontFamily: '"Kanit", sans-serif' }}
        >
          Crear Nueva Categoria
          <span
            style={{ marginLeft: "1rem" }}
            class="material-symbols-outlined"
          >
            add
          </span>
        </Button>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          {categoriasEmpleado.map((categoria, index) => (
            <Tab
              key={categoria.id}
              label={categoria.nombre}
              {...a11yProps(index)}
              style={{ fontFamily: '"Kanit", sans-serif' }}
            />
          ))}
        </Tabs>
      </Box>

      {!openForm &&
        categoriasEmpleado.map((categoria, index) => (
          <CustomTabPanel key={categoria.id} value={value} index={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                fontFamily: '"Kanit", sans-serif',
              }}
            >
              <div>
                <strong>Código Sindicato:</strong> {categoria.codigoSindicato}
              </div>
              <div>
                <strong>Cargo:</strong> {categoria.nombre}
              </div>
              <br />
              <div>
                <strong>Hora Estándar:</strong>{" "}
                {formatCurrency(categoria.horaEstandar) || formatCurrency(0)}
              </div>
              <div>
                <strong>Hora Extra:</strong>{" "}
                {formatCurrency(categoria.horaExtra) || formatCurrency(0)}
              </div>
              <div>
                <strong>Hora Feriado:</strong>{" "}
                {formatCurrency(categoria.horaFeriado) || formatCurrency(0)}
              </div>
              <div>
                <strong>Hora Larga Distancia:</strong>
                {" " || formatCurrency(0)}
                {formatCurrency(categoria.horaLargaDistancia) ||
                  formatCurrency(0)}
              </div>
              <div>
                <strong>Hora Traslado:</strong>{" "}
                {formatCurrency(categoria.horaTraslado) || formatCurrency(0)}
              </div>

              <Button
                variant="contained"
                onClick={() => handleEditValues(categoria.id)}
                sx={{ mt: 2, fontFamily: '"Kanit", sans-serif' }}
              >
                Editar Valores
                <span
                  style={{ marginLeft: "1rem", fontSize: "150%" }}
                  class="material-symbols-outlined"
                >
                  edit
                </span>
              </Button>
            </Box>
          </CustomTabPanel>
        ))}
      <Divider />
      <br />
      {openForm && <FormularioCategoria categoriaId={selectedCategoriaId} />}
    </Box>
  );
}
