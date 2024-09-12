import React, { createContext, useContext, useState } from "react";

// Creamos un contexto para el Drawer
export const DrawerContext = createContext();

// Hook personalizado para acceder al contexto del Drawer

// Componente proveedor del contexto del Drawer
export const DrawerContextComponent = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  // Resto de tu lógica para calcular el ancho del drawer, etc.

  // Agregamos la lógica para cambiar el estado de openDrawer
  const toggleDrawer = () => {
    setOpenDrawer((prevOpenDrawer) => !prevOpenDrawer);
  };

  // Aquí puedes agregar cualquier otra prop que desees pasar como data
  const data = {
    setOpenDrawer,
    openDrawer,
    toggleDrawer,
    // Otras props que quieras pasar
  };

  return (
    <DrawerContext.Provider value={data}>{children}</DrawerContext.Provider>
  );
};
