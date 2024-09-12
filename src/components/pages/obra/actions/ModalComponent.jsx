import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AutoComplete from "./AutoComplete";
import { db } from "../../../../firebaseConfig"; // Importa las funciones de Firebase necesarias
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

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

export default function ModalComponent({
  openModal,
  setOpenModal,
  arrayEmpleados,
  idObra,
  setActualizarEmpleados,
  setOpenProgress,
}) {
  const handleClose = () => setOpenModal(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = React.useState("");

  console.log(idObra);
  // Función para cargar el empleado en la obra
  const cargaEmpleadoObra = async () => {
    try {
      const obraRef = doc(db, "obras", idObra);
      const empleadoRef = doc(db, "empleados", selectedEmployee);

      // Obtener los datos actuales de horasEmpleado y obrasActivas
      const [obraDoc, empleadoDoc] = await Promise.all([
        getDoc(obraRef),
        getDoc(empleadoRef),
      ]);
      const horasEmpleadoActual = obraDoc.data().horasEmpleado || {};
      const obrasActivas = empleadoDoc.data().obrasActivas || [];

      // Construir el nuevo objeto horasEmpleado con el registro agregado
      const nuevoHorasEmpleado = {
        ...horasEmpleadoActual, // Mantener los datos existentes
        [selectedEmployee]: 0, // Agregar el nuevo registro
      };

      // Actualizar el documento de la obra con los nuevos datos de horasEmpleado
      await Promise.all([
        updateDoc(obraRef, { horasEmpleado: nuevoHorasEmpleado }),
        updateDoc(empleadoRef, { obrasActivas: arrayUnion(idObra) }), // Agregar el nuevo ID de obra al array
      ]);
      setActualizarEmpleados(true);
      setOpenModal(false);
    } catch (error) {
      console.error("Error al cargar empleado en la obra:", error);
    }
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AutoComplete
            arrayEmpleados={arrayEmpleados}
            setSelectedEmployee={setSelectedEmployee}
            selectedEmployee={selectedEmployee}
            setSelectedEmployeeName={setSelectedEmployeeName}
          />
          <h5 style={{ margin: "1rem", fontFamily: '"Kanit", sans-serif' }}>
            {selectedEmployeeName}
          </h5>
          <h5 style={{ margin: "1rem", fontFamily: '"Kanit", sans-serif' }}>
            ID: #{selectedEmployee}
          </h5>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              style={{ fontFamily: '"Kanit", sans-serif' }}
              variant="contained"
              onClick={() => cargaEmpleadoObra(idObra)} // Llama a la función cargaEmpleadoObra al hacer clic en el botón
            >
              CARGAR EMPLEADO
            </Button>
            <Button
              style={{ fontFamily: '"Kanit", sans-serif' }}
              onClick={handleClose}
            >
              CERRAR
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
