import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Autocomplete } from "@mui/material";
import { db } from "../../../../firebaseConfig";
import DatePickerComponent from "./DatePickerComponent";
import { doc, getDoc } from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalHoraValor({
  openModal,
  setOpenModal,
  setSelectedHora,
  selectedHora,
  horaValor,
  setTipoHora,
  setFechaHora,
  fechaHora,
  setHoraEdit,
  horaEdit,
  setHoraValor,
  actionData,
}) {
  const [loading, setLoading] = useState(true);
  const [preSeleccion, setPreSeleccion] = useState(null);
  const [displayValue, setDisplayValue] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const empleadoId = actionData ? actionData.empleadoId : null;

  useEffect(() => {
    if (!empleadoId) {
      setLoading(false);
      return;
    }

    const fetchHoraValores = async () => {
      try {
        const docRef = doc(db, "empleados", empleadoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let data = docSnap.data().categoriaEmpleado || [];

          // Forzamos la conversión a array si no lo es
          if (!Array.isArray(data)) {
            data = [data];
          }

          setCategorias(data);
        } else {
          console.log("¡No existe tal documento!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
      setLoading(false);
    };

    fetchHoraValores();
  }, [empleadoId]);

  const handleChange = (event, newValue) => {
    setSelectedCategory(newValue);
    if (newValue) {
      // Aquí seleccionamos solo el valor de la propiedad deseada
      setPreSeleccion(newValue.value); // Ajusta 'value' según la propiedad que desees utilizar
      setHoraValor(newValue.value);
      setTipoHora(newValue.key); // Ajusta según lo que necesites guardar
    } else {
      setPreSeleccion(null);
      setHoraValor(null);
      setTipoHora(null);
    }
  };

  console.log(preSeleccion);

  const handleConfirm = () => {
    setSelectedHora(preSeleccion);
    console.log(`Valor de hora seleccionado: ${selectedHora}`);
    handleClose();
    setPreSeleccion(null);
  };

  const handleChangeHora = (event) => {
    const { value } = event.target;
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      setDisplayValue(value);
      setHoraEdit(value === "" ? null : parseFloat(value));
    }
  };

  console.log(horaEdit);
  console.log(selectedCategory);

  // Si categorias no es un array, devuelve un array vacío
  const categoriasOptions = Array.isArray(categorias)
    ? categorias.reduce((acc, categoria) => {
        Object.keys(categoria).forEach((key) => {
          if (
            key !== "id" &&
            key !== "nombre" &&
            key !== "codigoSindicato" &&
            categoria[key] !== null &&
            categoria[key] !== undefined
          ) {
            acc.push({ key, value: categoria[key] });
          }
        });
        return acc;
      }, [])
    : [];

  const formatKey = (key) => {
    // Separa las palabras por camelCase o PascalCase
    const words = key.replace(/([A-Z])/g, " $1").split(" ");

    // Capitaliza la primera letra de cada palabra
    const formattedWords = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return formattedWords;
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-titulo"
        aria-describedby="modal-descripcion"
      >
        <Box sx={style}>
          <Typography
            style={{ fontFamily: '"Kanit", sans-serif' }}
            id="modal-titulo"
            variant="h6"
            component="h2"
          >
            Seleccionar Valor de Hora
          </Typography>
          {loading ? (
            <Typography
              style={{ fontFamily: '"Kanit", sans-serif' }}
              id="loading"
              variant="body1"
              component="p"
            >
              Cargando...
            </Typography>
          ) : (
            <Autocomplete
              id="select-hora"
              options={categoriasOptions}
              getOptionLabel={(option) => {
                const formattedValue = option.value.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                });
                return `${formatKey(option.key)}: ${formattedValue}`;
              }}
              value={selectedCategory}
              onChange={handleChange}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar Categoría"
                  variant="outlined"
                  style={{ fontFamily: '"Kanit", sans-serif' }}
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      fontFamily: '"Kanit", sans-serif',
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      fontFamily: '"Kanit", sans-serif',
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} style={{ fontFamily: '"Kanit", sans-serif' }}>
                  {`${formatKey(option.key)}: ${option.value.toLocaleString(
                    "es-AR",
                    {
                      style: "currency",
                      currency: "ARS",
                    }
                  )}`}
                </li>
              )}
            />
          )}
          {preSeleccion && (
            <div>
              <Typography
                style={{ fontFamily: '"Kanit", sans-serif' }}
                id="modal-descripcion"
                sx={{ mt: 2 }}
              >
                Valor de Hora Seleccionado:
              </Typography>
              <ul>
                {Object.keys(preSeleccion).map((key) => (
                  <li key={key}> {preSeleccion[key]}</li>
                ))}
              </ul>
              <Typography
                style={{ fontFamily: '"Kanit", sans-serif' }}
                id="modal-descripcion"
                sx={{ mt: 2 }}
              >
                Total:{" "}
                {(preSeleccion * horaEdit).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Typography>
            </div>
          )}

          <DatePickerComponent
            setFechaHora={setFechaHora}
            fechaHora={fechaHora}
          />
          <TextField
            id="filled-basic"
            label="Cantidad Horas"
            variant="filled"
            value={displayValue}
            onChange={handleChangeHora}
            inputProps={{ inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]?" }}
            style={{ marginTop: "1rem" }}
          />

          {preSeleccion && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              sx={{ mt: 2, fontFamily: '"Kanit", sans-serif' }}
            >
              Confirmar Selección
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
}
