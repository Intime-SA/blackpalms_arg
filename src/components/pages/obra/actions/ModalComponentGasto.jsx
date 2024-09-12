import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AutoComplete from "./AutoComplete";
import { db } from "../../../../firebaseConfig"; // Importa las funciones de Firebase necesarias
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import AutoCompleteCategory from "./AutocompleteCategory";
import AutoCompleteProveedor from "./AutocompleteProveedor";
import FedeMenu from "./FedeMenu";
import { Height } from "@mui/icons-material";
import { TextField } from "@mui/material";
import DatePicker from "./DatePickerComponent";
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
  width: 400,
  height: "100vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
};

export default function ModalComponentGasto({
  openModalGasto,
  setOpenModalGasto,
  idObra,
  idCliente,
  setCambioGastos,
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
  const [montoLimpioImpuesto, setMontoLimpioImpuesto] = React.useState(null);
  const [openImpuestos, setOpenImpuestos] = React.useState(null);

  console.log(idObra);

  const convertirAFirestoreTimestamp = (selectedOption2) => {
    if (selectedOption2) {
      const fechaJavaScript = selectedOption2.$d;

      // Crea un objeto Date de JavaScript a partir de la fecha extraída
      const fechaDate = new Date(fechaJavaScript);

      // Convierte el objeto Date en una marca de tiempo de Firestore
      const timestamp = Timestamp.fromDate(fechaDate);

      return timestamp;
    }
    // Extrae la fecha del objeto M2
  };

  // Obtener la marca de tiempo de Firestore a partir de selectedOption2
  const timestampFirestore = convertirAFirestoreTimestamp(selectedOption2);

  function calcularMontoTotal(importe, impuestos) {
    // Suma los montos de todos los impuestos
    const totalImpuestos = impuestos.reduce(
      (total, impuesto) => total + impuesto.monto,
      0
    );

    // Suma el importe con el total de los impuestos
    const montoTotal = importe + totalImpuestos;

    return montoTotal;
  }
  // Luego, puedes utilizar timestampFirestore para guardar la fecha en Firestore
  // Por ejemplo, utilizando addDoc como se mostró en la respuesta anterior.

  // Función para cargar el empleado en la obra
  const cargaGastoObra = async () => {
    try {
      // Validar la existencia de las propiedades requeridas
      if (!categoria || !proveedor || !descripcion) {
        console.error("Faltan datos requeridos para cargar el gasto.");
        return;
      }

      // Crear objeto de gasto
      const gasto = {
        obraId: idObra,
        fechaCarga: serverTimestamp(),
        fechaGasto: timestampFirestore,
        clienteId: idCliente,
        categoria: categoria,
        subcategoria: subCategoria,
        proveedorId: proveedor,
        descripcion: descripcion,
        gastoGlobal: false,
        gastoObra: true,
        importe: montoLimpio,
        tipoComprobante: tipoComprobante,
        numeroComprobante: numeroComprobante,
        numeroPuntoVenta: numeroPuntoVenta,
        impuestos: impuesto,
        montoTotal: calcularMontoTotal(montoLimpio, impuesto),
      };
      console.log(gasto);

      // Agregar el objeto de gasto a la colección de Firebase
      const gastoDocRef = await addDoc(collection(db, "gastos"), gasto);

      // Obtener el ID del gasto recién creado
      const gastoId = gastoDocRef.id;

      // Actualizar el documento de la obra para agregar el ID del gasto al array correspondiente
      const obraDocRef = doc(db, "obras", idObra);
      await updateDoc(obraDocRef, {
        [`gastos.${categoria}`]: arrayUnion(gastoId),
      });

      // Cerrar el modal después de cargar el gasto
      setCambioGastos(true);
      setOpenModalGasto(false);
    } catch (error) {
      console.error("Error al cargar el gasto en la obra:", error);
    }
  };
  function limpiarYConvertir(numeroConSigno) {
    if (numeroConSigno) {
      // Eliminar el signo de dólar y los puntos
      const limpio = numeroConSigno.replace(/[$.]/g, "");
      // Reemplazar comas por puntos para convertir en decimal
      const limpioConPuntos = limpio.replace(",", ".");
      // Convertir a número decimal
      return parseFloat(limpioConPuntos);
    }
    return 0;
  }

  const handleMontoChange = (value) => {
    // Formatea el valor mientras escribes para que tenga el formato deseado
    const formattedValue = formatNumber(value);
    // Actualiza el estado con el valor formateado
    setMonto(formattedValue);
    // Limpia y convierte el valor formateado
    const cleanedValue = limpiarYConvertir(formattedValue);
    // Actualiza el estado con el valor limpio y convertido
    setMontoLimpio(cleanedValue);
  };

  const formatNumber = (value) => {
    // Si el valor está vacío, devuelve el formato predeterminado
    if (!value) return "$0,00";

    // Elimina cualquier caracter que no sea un número
    const cleanValue = value.replace(/[^\d]/g, "");

    // Convierte el valor a número
    const numberValue = parseFloat(cleanValue);

    // Formatea el valor como moneda
    const formattedValue = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(numberValue / 100); // Dividimos por 100 para manejar los centavos correctamente

    // Devuelve el valor formateado
    return formattedValue;
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%", // Ajusta el ancho según tus necesidades
    maxWidth: 600, // Limita el ancho máximo
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
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
            <h6>Gasto Obra ID: #{idObra}</h6>
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
        <AutoCompleteProveedor
          setProveedor={setProveedor}
          proveedor={proveedor}
        />

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
        />
        <TextField
          id="monto"
          label="Subtotal Neto"
          variant="standard"
          value={monto}
          onChange={(e) => handleMontoChange(e.target.value)}
          sx={{ marginBottom: "1rem" }}
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
            onClick={() => cargaGastoObra()}
          >
            Cargar Gasto
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
