import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";

const IngresoForm = () => {
  const [cuenta, setCuenta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [monto, setMonto] = useState("");
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [cliente, setCliente] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState("");
  const [numberOrder, setNumberOrder] = useState();
  const [montoFormateado, setMontoFormateado] = useState(0);

  const [errors, setErrors] = useState({});

  const { clientes, cuentas } = useContext(TableContext);

  useEffect(() => {
    const traerId = async () => {
      try {
        const refContador = doc(db, "contador", "contadorIngreso");

        await runTransaction(db, async (transaction) => {
          const docContador = await transaction.get(refContador);
          const nuevoValor = docContador.data().autoincremental + 1;

          transaction.update(refContador, { autoincremental: nuevoValor });
          setNumberOrder(nuevoValor);
        });
      } catch (error) {
        console.error("Error al obtener el nuevo ID:", error);
      }
    };

    traerId();
  }, []);

  console.log(numberOrder);

  const validate = () => {
    let tempErrors = {};

    if (!cuenta) tempErrors.cuenta = "Este campo es obligatorio.";
    if (!descripcion) tempErrors.descripcion = "Este campo es obligatorio.";
    if (!fechaIngreso) tempErrors.fechaIngreso = "Este campo es obligatorio.";
    if (!monto || isNaN(monto))
      tempErrors.monto =
        "Por favor, introduce un valor numérico válido para el monto.";
    if (!numeroComprobante)
      tempErrors.numeroComprobante = "Este campo es obligatorio.";
    if (!cliente) tempErrors.cliente = "Este campo es obligatorio.";
    if (!tipoComprobante)
      tempErrors.tipoComprobante = "Este campo es obligatorio.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const nuevoIngreso = {
        numberOrder: numberOrder,
        cuenta: cuenta.id,
        descripcion,
        fechaIngreso: new Date(fechaIngreso),
        monto: Number(monto),
        numeroComprobante,
        clienteId: cliente.id,
        tipoComprobante: tipoComprobante.id,
      };

      const docRef = await addDoc(collection(db, "ingresos"), nuevoIngreso);

      // Limpiar los campos después de agregar el ingreso
      setCuenta("");
      setDescripcion("");
      setFechaIngreso("");
      setMonto("");
      setNumeroComprobante("");
      setCliente(null);
      setTipoComprobante("");

      console.log("Ingreso agregado correctamente con ID: ", docRef.id);
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar el ingreso:", error);
    }
  };

  const handleMontoChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Elimina cualquier carácter no numérico
    if (/^\d*\.?\d*$/.test(value)) {
      const numericValue = Number(value); // Convertir a número
      setMonto((numericValue / 100).toFixed(2)); // Almacenar el número con dos decimales

      // Formatear el número sin símbolo de moneda
      const formateador = new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setMontoFormateado(formateador.format(numericValue / 100)); // Formatear el valor numérico
    }
  };

  const handleInput = (e) => {
    e.target.value = e.target.value.replace(/[$.,]/g, "");
  };

  const tipos = [{ id: "Efectivo" }, { id: "Transferencia" }, { id: "Cheque" }];

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{ maxWidth: "1000px", marginLeft: "1rem", marginTop: "2rem" }}
    >
      <Autocomplete
        id="cliente-select"
        options={clientes}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, value) => setCliente(value)}
        value={cliente}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Cliente"
            variant="outlined"
            error={!!errors.cliente}
            helperText={errors.cliente}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                fontFamily: '"Kanit", sans-serif',
              },
            }}
          />
        )}
      />
      <Autocomplete
        id="cuenta-select"
        options={cuentas}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, value) => setCuenta(value)}
        value={cuenta.id}
        style={{ marginTop: "1rem" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Cuenta Ingreso"
            variant="outlined"
            error={!!errors.cuenta}
            helperText={errors.cuenta}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                fontFamily: '"Kanit", sans-serif',
              },
            }}
          />
        )}
      />
      <Autocomplete
        id="tipo-select"
        options={tipos}
        getOptionLabel={(tipo) => tipo.id}
        onChange={(event, value) => setTipoComprobante(value)}
        value={tipoComprobante.id}
        style={{ marginTop: "1rem" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tipo de Pago"
            variant="outlined"
            error={!!errors.tipoComprobante}
            helperText={errors.tipoComprobante}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              ...params.InputProps,
              style: {
                fontFamily: '"Kanit", sans-serif',
              },
            }}
          />
        )}
      />
      <TextField
        label="Descripción"
        variant="outlined"
        fullWidth
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        margin="normal"
        error={!!errors.descripcion}
        helperText={errors.descripcion}
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
        label="Fecha de Ingreso"
        variant="outlined"
        type="datetime-local"
        fullWidth
        value={fechaIngreso}
        onChange={(e) => setFechaIngreso(e.target.value)}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.fechaIngreso}
        helperText={errors.fechaIngreso}
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
        label="Monto"
        value={montoFormateado}
        variant="outlined"
        fullWidth
        onChange={handleMontoChange}
        onInput={handleInput} // Validar entrada
        margin="normal"
        error={!!errors.monto}
        helperText={errors.monto}
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
        label="Número de Comprobante"
        variant="outlined"
        fullWidth
        value={numeroComprobante}
        onChange={(e) => setNumeroComprobante(e.target.value)}
        margin="normal"
        error={!!errors.numeroComprobante}
        helperText={errors.numeroComprobante}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          style: {
            fontFamily: '"Kanit", sans-serif',
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ fontFamily: '"Kanit", sans-serif' }}
      >
        Agregar Ingreso
      </Button>
    </form>
  );
};

export default IngresoForm;
