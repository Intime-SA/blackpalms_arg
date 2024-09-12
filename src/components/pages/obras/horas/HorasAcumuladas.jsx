// HorasAcumuladas.jsx
import React from "react";

const HorasAcumuladas = ({ horasEmpleado }) => {
  // Calcular la suma de las horas

  const totalHoras = Object.values(horasEmpleado).reduce(
    (acc, horas) => acc + horas,
    0
  );

  return <div style={{ textAlign: "right" }}>{totalHoras}</div>;
};

export default HorasAcumuladas;
