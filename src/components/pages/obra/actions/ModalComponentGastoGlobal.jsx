import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AutoComplete from "./AutoComplete";
import { db } from "../../../../firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import AutoCompleteCategory from "./AutocompleteCategory";
import AutoCompleteProveedor from "./AutocompleteProveedor";
import FedeMenu from "./FedeMenu";
import { TextField } from "@mui/material";
import DatePickerComponent from "./DatePickerComponent";
import FadeMenuImpuestos from "./FadeMenuImpuestos";
import SpanningTable from "./SpanningTable";
import "./ModalFont.css";
import AutoCompleteSubCategory from "./AutoCompleteSubCategory";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  zoom: "0.8",
};

export default function ModalComponentGastoGlobal({
  openModalGasto,
  setOpenModalGasto,
}) {
  const handleClose = () => setOpenModalGasto(false);

  const [categoria, setCategoria] = React.useState("");
  const [subCategoria, setSubCategoria] = React.useState("");
  const [proveedor, setProveedor] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [monto, setMonto] = React.useState("$0,00");
  const [impuesto, setImpuesto] = React.useState([]);
  const [tipoComprobante, setTipoComprobante] = React.useState("");
  const [numeroComprobante, setNumeroComprobante] = React.useState("");
  const [numeroPuntoVenta, setNumeroPuntoVenta] = React.useState("");
  const [selectedOption2, setSelectedOption2] = React.useState(null);
  const [montoLimpio, setMontoLimpio] = React.useState(null);
  const [openImpuestos, setOpenImpuestos] = React.useState(null);

  const convertirAFirestoreTimestamp = (selectedOption2) => {
    if (selectedOption2) {
      const fechaJavaScript = selectedOption2.$d;
      const fechaDate = new Date(fechaJavaScript);
      const timestamp = Timestamp.fromDate(fechaDate);
      return timestamp;
    }
  };

  const timestampFirestore = convertirAFirestoreTimestamp(selectedOption2);

  function calcularMontoTotal(importe, impuestos) {
    const totalImpuestos = impuestos.reduce(
      (total, impuesto) => total + impuesto.monto,
      0
    );
    const montoTotal = importe + totalImpuestos;
    return montoTotal;
  }

  const cargaGastoGlobal = async () => {
    try {
      if (!categoria || !descripcion) {
        console.error("Faltan datos requeridos para cargar el gasto.");
        return;
      }

      const gasto = {
        fechaCarga: serverTimestamp(),
        fechaGasto: timestampFirestore,
        categoria: categoria,
        subcategoria: subCategoria,
        proveedorId: "",
        clienteId: "",
        descripcion: descripcion,
        gastoGlobal: true,
        gastoObra: false,
        importe: montoLimpio,
        tipoComprobante: tipoComprobante,
        numeroComprobante: numeroComprobante,
        numeroPuntoVenta: numeroPuntoVenta,
        impuestos: impuesto,
        montoTotal: calcularMontoTotal(montoLimpio, impuesto),
      };
      console.log(gasto);

      await addDoc(collection(db, "gastos"), gasto);

      setOpenModalGasto(false);
      window.location.reload();
    } catch (error) {
      console.error("Error al cargar el gasto global:", error);
    }
  };

  function limpiarYConvertir(numeroConSigno) {
    if (numeroConSigno) {
      const limpio = numeroConSigno.replace(/[$.]/g, "");
      const limpioConPuntos = limpio.replace(",", ".");
      return parseFloat(limpioConPuntos);
    }
    return 0;
  }

  const handleMontoChange = (value) => {
    const formattedValue = formatNumber(value);
    setMonto(formattedValue);
    const cleanedValue = limpiarYConvertir(formattedValue);
    setMontoLimpio(cleanedValue);
  };

  const formatNumber = (value) => {
    if (!value) return "$0,00";
    const cleanValue = value.replace(/[^\d]/g, "");
    const numberValue = parseFloat(cleanValue);
    const formattedValue = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(numberValue / 100);
    return formattedValue;
  };

  console.log(impuesto);
  return (
    <Modal
      open={openModalGasto}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
          <div>
            <h6>Gasto Global</h6>
            <span class="material-symbols-outlined">public</span>
          </div>
        </Box>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FedeMenu
            setTipoComprobante={setTipoComprobante}
            tipoComprobante={tipoComprobante}
            setOpenImpuestos={setOpenImpuestos}
          />
          <DatePickerComponent
            setSelectedOption2={setSelectedOption2}
            selectedOption2={selectedOption2}
          />
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <TextField
            id="numeroPuntoVenta"
            label="N° P.vta"
            variant="standard"
            value={numeroPuntoVenta}
            onChange={(e) => setNumeroPuntoVenta(e.target.value)}
            sx={{ width: "7rem" }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              style: {
                fontFamily: '"Kanit", sans-serif',
              },
            }}
          />
          <span
            className="material-symbols-outlined"
            style={{ marginTop: "1rem" }}
          >
            remove
          </span>
          <TextField
            id="numeroComprobante"
            label="N°Comprobante"
            variant="standard"
            value={numeroComprobante}
            sx={{ width: "20rem" }}
            onChange={(e) => setNumeroComprobante(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              style: {
                fontFamily: '"Kanit", sans-serif',
              },
            }}
          />
        </Box>
        <AutoCompleteCategory
          setCategoria={setCategoria}
          categoria={categoria}
        />
        {categoria && (
          <AutoCompleteSubCategory
            setSubCategoria={setSubCategoria}
            subCategoria={subCategoria}
            categoria={categoria}
          />
        )}

        <TextField
          multiline
          rows={4}
          id="descripcion"
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ marginBottom: "1rem", marginTop: "2rem" }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <TextField
          id="monto"
          label="Subtotal Neto"
          variant="standard"
          value={monto}
          onChange={(e) => handleMontoChange(e.target.value)}
          sx={{ marginBottom: "1rem" }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: {
              fontFamily: '"Kanit", sans-serif',
            },
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {openImpuestos && (
            <FadeMenuImpuestos
              setMontoLimpio={setMontoLimpio}
              formatNumber={formatNumber}
              limpiarYConvertir={limpiarYConvertir}
              setImpuesto={setImpuesto}
              impuesto={impuesto}
            />
          )}
        </div>
        <SpanningTable impuesto={impuesto} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "150%",
            margin: "1rem",
            backgroundColor: "#f7f7f7", // Color de fondo
            padding: "1rem",
            borderRadius: "8px", // Bordes redondeados
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Sombra
          }}
        >
          <p className="bebas-neue-regular" style={{ color: "green" }}>
            TOTAL COMPROBANTE:{" "}
          </p>
          <p
            className="bebas-neue-regular"
            style={{ color: "green", fontWeight: "bold" }}
          >
            {calcularMontoTotal(montoLimpio, impuesto).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </p>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => cargaGastoGlobal()}
            style={{ fontFamily: '"Kanit", sans-serif' }}
          >
            Cargar Gasto
          </Button>
          <Button
            style={{ fontFamily: '"Kanit", sans-serif' }}
            variant="outlined"
            onClick={handleClose}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
