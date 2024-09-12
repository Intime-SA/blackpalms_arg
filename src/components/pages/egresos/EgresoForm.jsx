import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { TableContext } from "../../context/TableContext";
import { Checkbox } from "@mui/material";

const EgresoForm = () => {
  const [cuenta, setCuenta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEgreso, setFechaEgreso] = useState("");
  const [monto, setMonto] = useState("");
  const [numeroComprobante, setNumeroComprobante] = useState("");
  const [proveedor, setProveedor] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState(null);
  const [numberOrder, setNumberOrder] = useState();
  const [montoFormateado, setMontoFormateado] = useState(0);
  const [errors, setErrors] = useState({});
  const [concepto, setConcepto] = useState(null);
  const { proveedores, cuentas, conceptos } = useContext(TableContext);
  const [subConcepto, setSubConcepto] = useState(null);

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

  const validate = () => {
    let tempErrors = {};

    if (!cuenta) tempErrors.cuenta = "Este campo es obligatorio.";
    if (!descripcion) tempErrors.descripcion = "Este campo es obligatorio.";
    if (!fechaEgreso) tempErrors.fechaEgreso = "Este campo es obligatorio.";
    if (!monto || isNaN(monto))
      tempErrors.monto =
        "Por favor, introduce un valor numérico válido para el monto.";
    if (!numeroComprobante)
      tempErrors.numeroComprobante = "Este campo es obligatorio.";
    if (checkedProveedores && !proveedor)
      tempErrors.proveedor = "Este campo es obligatorio.";

    if (!tipoComprobante)
      tempErrors.tipoComprobante = "Este campo es obligatorio.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Validación del monto

    try {
      const nuevoEgreso = {
        numberOrder: numberOrder,
        cuenta: cuenta.id,
        descripcion,
        fechaEgreso: new Date(fechaEgreso),
        monto: Number(monto),
        numeroComprobante,
        proveedorId: checkedProveedores ? proveedor.id : "",
        tipoComprobante: tipoComprobante.id,
        conceptoPagoId: checkedPagos ? concepto.id : "",
      };

      const docRef = await addDoc(collection(db, "egresos"), nuevoEgreso);

      // Limpiar los campos después de agregar el egreso
      setCuenta("");
      setDescripcion("");
      setFechaEgreso("");
      setMonto("");
      setNumeroComprobante("");
      setProveedor(null);
      setTipoComprobante("");
      setConcepto("");
      setSubConcepto("");

      console.log("Egreso agregado correctamente con ID: ", docRef.id);
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar el egreso:", error);
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

  const [checkedProveedores, setCheckedProveedores] = React.useState(false);
  const [checkedPagos, setCheckedPagos] = React.useState(false);

  const handleChangeCheckBoxPago = (event) => {
    setCheckedPagos(event.target.checked);
  };
  const handleChangeCheckBoxProveedor = (event) => {
    setCheckedProveedores(event.target.checked);
  };

  const getSubconceptosList = (subconceptosMap) => {
    if (!subconceptosMap) return [];
    return Object.values(subconceptosMap);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{ maxWidth: "1000px", marginLeft: "1rem", marginTop: "1.5rem" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          maxWidth: "1000px",
          margin: "1.5rem",
        }}
      >
        <div
          style={{
            display: checkedPagos ? "none" : "flex",
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          <Checkbox
            checked={checkedProveedores}
            onChange={handleChangeCheckBoxProveedor}
            inputProps={{ "aria-label": "controlled" }}
          />{" "}
          <h5>Pagos Proveedores</h5>
        </div>

        <div
          style={{
            display: checkedProveedores ? "none" : "flex",
            fontFamily: '"Kanit", sans-serif',
          }}
        >
          <Checkbox
            checked={checkedPagos}
            onChange={handleChangeCheckBoxPago}
            inputProps={{ "aria-label": "controlled" }}
          />{" "}
          <h5>Pagos Varios</h5>
        </div>
      </div>

      {(checkedPagos || checkedProveedores) && (
        <div>
          {checkedProveedores && !checkedPagos && (
            <Autocomplete
              id="proveedor-select"
              options={proveedores}
              getOptionLabel={(option) => option.nombreComercio}
              onChange={(event, value) => setProveedor(value)}
              value={proveedor}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar proveedor"
                  variant="outlined"
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
          )}
          {checkedPagos && !checkedProveedores && (
            <Autocomplete
              id="concept-select"
              options={conceptos}
              getOptionLabel={(option) => option.nombre}
              onChange={(event, value) => setConcepto(value)}
              value={concepto}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar Concepto"
                  variant="outlined"
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
          )}
          {concepto && (
            <Autocomplete
              id="subConcept-select"
              options={getSubconceptosList(concepto.subconceptos)}
              getOptionLabel={(option) => option.nombre}
              onChange={(event, value) => setSubConcepto(value)}
              value={subConcepto}
              style={{ marginTop: "1rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub-Concepto"
                  variant="outlined"
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
          )}

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
                label="Seleccionar Cuenta Origen"
                variant="outlined"
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
            value={tipoComprobante}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            style={{ marginTop: "1rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{
                  fontFamily: '"Kanit", sans-serif',
                }}
                label="Tipo de Pago"
                variant="outlined"
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
            label="Fecha de Egreso"
            variant="outlined"
            type="datetime-local"
            fullWidth
            value={fechaEgreso}
            onChange={(e) => setFechaEgreso(e.target.value)}
            margin="normal"
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
            label="Número de Comprobante / Referencia"
            variant="outlined"
            fullWidth
            value={numeroComprobante}
            onChange={(e) => setNumeroComprobante(e.target.value)}
            margin="normal"
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
            style={{ fontFamily: '"Kanit", sans-serif' }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Agregar Egreso
          </Button>
        </div>
      )}
    </form>
  );
};

export default EgresoForm;
