import * as React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { db } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import "./ModalObra.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "100vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalObra({
  openModalObra,
  setOpenModalObra,
  setActualizarObras,
}) {
  const [cliente, setCliente] = React.useState(null);
  const [clientes, setClientes] = React.useState([]);
  const [descripcion, setDescripcion] = React.useState("");
  const [lugar, setLugar] = React.useState("");
  const [presupuestoInicial, setPresupuestoInicial] = React.useState("");
  const [distancia, setDistancia] = React.useState({
    nombre: "Corta Distancia",
    value: "corta",
  });
  const [presupuestoFormateado, setPresupuestoFormateado] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const handleClose = () => setOpenModalObra(false);

  React.useEffect(() => {
    const fetchClients = async () => {
      const collectionClientes = collection(db, "clientes");
      const snapshotClientes = await getDocs(collectionClientes);
      let arrayClients = [];
      snapshotClientes.forEach((client) => {
        arrayClients.push({ id: client.id, ...client.data() });
      });
      setClientes(arrayClients);
    };
    fetchClients();
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.cliente = cliente ? "" : "Este campo es requerido.";
    tempErrors.descripcion = descripcion ? "" : "Este campo es requerido.";
    tempErrors.lugar = lugar ? "" : "Este campo es requerido.";
    tempErrors.presupuestoInicial = presupuestoInicial
      ? ""
      : "Este campo es requerido.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const nuevaObra = {
        cliente,
        descripcion,
        estado: "enProceso",
        lugar,
        presupuestoInicial: parseFloat(presupuestoInicial),
        presupuestoActual: 0,
        gastos: [],
        horasEmpleado: {},
        fechaInicio: serverTimestamp(),
        distancia,
      };

      await addDoc(collection(db, "obras"), nuevaObra);
      setActualizarObras(true);
      handleClose();
    } catch (error) {
      console.error("Error al agregar la obra:", error);
    }
  };

  const formatCurrency = (value) => {
    if (value === "") return "";
    value = value.replace(/[^\d]/g, "");
    return (
      "$" +
      parseFloat(value).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const handlePresupuestoChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setPresupuestoInicial(rawValue);
    setPresupuestoFormateado(formatCurrency(rawValue));
  };

  return (
    <div>
      <Modal
        open={openModalObra}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h4"
            component="h2"
            className="bebas-neue-regular"
          >
            Crear Obra
          </Typography>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              id="cliente-autocomplete"
              options={clientes}
              getOptionLabel={(option) => option.nombre}
              value={clientes.find((option) => option.id === cliente)}
              onChange={(event, newValue) => {
                setCliente(newValue ? newValue.id : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente"
                  fullWidth
                  error={!!errors.cliente}
                  helperText={errors.cliente}
                />
              )}
            />
            <TextField
              id="descripcion"
              label="Descripcion"
              multiline
              rows={6}
              fullWidth
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              margin="normal"
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
            <TextField
              id="lugar"
              label="Lugar"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              error={!!errors.lugar}
              helperText={errors.lugar}
            />
            <Autocomplete
              id="distancia-autocomplete"
              options={[
                { nombre: "Larga Distancia", value: "larga" },
                { nombre: "Corta Distancia", value: "corta" },
              ]}
              getOptionLabel={(option) => option.nombre}
              value={distancia}
              onChange={(event, newValue) => {
                setDistancia(
                  newValue
                    ? newValue
                    : { nombre: "Corta Distancia", value: "corta" }
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Zona" fullWidth />
              )}
            />
            <TextField
              id="presupuestoInicial"
              label="Presupuesto Inicial"
              variant="outlined"
              fullWidth
              margin="normal"
              value={presupuestoFormateado}
              onChange={handlePresupuestoChange}
              error={!!errors.presupuestoInicial}
              helperText={errors.presupuestoInicial}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="success">
                Crear Obra
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
