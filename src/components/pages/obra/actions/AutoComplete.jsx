import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function AutoComplete({
  arrayEmpleados,
  setSelectedEmployee,
  selectedEmployee,
  setSelectedEmployeeName,
}) {
  const [array, setArray] = React.useState([]);

  React.useEffect(() => {
    const consultaEmpleados = async () => {
      try {
        const collectionEmpleados = collection(db, "empleados");
        const EmpleadosSnapshot = await getDocs(collectionEmpleados);
        const EmpleadosData = EmpleadosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtrar empleados que no están en arrayEmpleados
        const empleadosSinObraActiva = EmpleadosData.filter(
          (empleado) => !arrayEmpleados.some((e) => e.id === empleado.id)
        );

        // Actualizar el estado con los empleados filtrados
        setArray(empleadosSinObraActiva);
      } catch (error) {
        console.error("Error fetching Empleados:", error);
      }
    };

    consultaEmpleados();
  }, [arrayEmpleados]); // Agregar arrayEmpleados como dependencia para que se vuelva a ejecutar cuando cambie

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedEmployee(selectedId);

    // Busca el empleado seleccionado en el array filtrado
    const selectedEmployee = array.find(
      (empleado) => empleado.id === selectedId
    );

    // Si se encuentra el empleado, pasa su nombre a setSelectedEmployeeName
    if (selectedEmployee) {
      setSelectedEmployeeName(
        `${selectedEmployee.nombre} ${selectedEmployee.apellido}`
      );
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          style={{ fontFamily: '"Kanit", sans-serif' }}
          id="demo-simple-select-label"
        >
          Seleccionar Empleado
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedEmployee}
          label="Seleccionar Empleado"
          onChange={handleChange}
          style={{ fontFamily: '"Kanit", sans-serif' }}
        >
          {array.map((empleado) => (
            <MenuItem
              style={{ fontFamily: '"Kanit", sans-serif' }}
              key={empleado.id}
              value={empleado.id}
            >
              {empleado.nombre} {empleado.apellido}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
