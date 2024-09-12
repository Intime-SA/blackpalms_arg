import React from "react";

const FormattedDate = ({ timestamp }) => {
  // Convertir segundos y nanosegundos a milisegundos totales
  const totalMilliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;

  // Crear un objeto de fecha con el total de milisegundos
  const date = new Date(totalMilliseconds);

  // Formatear la fecha a DD/MM/YYYY
  const formattedDate = date.toLocaleDateString("en-GB"); // 'en-GB' formatea la fecha como DD/MM/YYYY

  return <div>{formattedDate}</div>;
};

export default FormattedDate;
