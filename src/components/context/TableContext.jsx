import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Crea un contexto para las tablas (proveedores, clientes y obras)
export const TableContext = createContext();

// Hook personalizado para acceder al contexto de las tablas
export const useTablas = () => {
  return useContext(TableContext);
};

// Proveedor de contexto que contiene el estado de las tablas y funciones relacionadas
export const TableContextComponent = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [horas, setHoras] = useState([]);
  const [categoriasEmpleado, setCategoriasEmpleado] = useState([]);

  const fetchData = async (collectionName, setData) => {
    try {
      const ref = collection(db, collectionName);
      const snapshot = await getDocs(ref);
      const dataArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(dataArray);
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
    }
  };

  const actualizarTabla = async (tabla) => {
    switch (tabla) {
      case "proveedores":
        await fetchData("proveedores", setProveedores);
        break;
      case "clientes":
        await fetchData("clientes", setClientes);
        break;
      case "obras":
        await fetchData("obras", setObras);
        break;
      case "gastos":
        await fetchData("gastos", setGastos);
        break;
      case "categorias":
        await fetchData("categorias", setCategorias);
        break;
      case "ventas":
        await fetchData("ventas", setVentas);
        break;
      case "empleados":
        await fetchData("empleados", setEmpleados);
        break;
      case "egresos":
        await fetchData("egresos", setEgresos);
        break;
      case "cuentas":
        await fetchData("cuentas", setCuentas);
        break;
      case "ingresos":
        await fetchData("ingresos", setIngresos);
        break;
      case "conceptos":
        await fetchData("conceptos", setConceptos);
        break;
      case "horas":
        await fetchData("horas", setHoras);
        break;
      case "categoriasEmpleado":
        await fetchData("categoriasEmpleado", setCategoriasEmpleado);
        break;
      default:
        console.error(`Tabla ${tabla} no reconocida`);
    }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      await fetchData("proveedores", setProveedores);
      await fetchData("clientes", setClientes);
      await fetchData("obras", setObras);
      await fetchData("gastos", setGastos);
      await fetchData("categorias", setCategorias);
      await fetchData("ventas", setVentas);
      await fetchData("empleados", setEmpleados);
      await fetchData("egresos", setEgresos);
      await fetchData("cuentas", setCuentas);
      await fetchData("ingresos", setIngresos);
      await fetchData("conceptos", setConceptos);
      await fetchData("horas", setHoras);
      await fetchData("categoriasEmpleado", setCategoriasEmpleado);
    };

    obtenerDatos();
  }, []);

  // Objeto de datos para el contexto
  const data = {
    proveedores,
    clientes,
    obras,
    gastos,
    categorias,
    ventas,
    empleados,
    egresos,
    cuentas,
    ingresos,
    conceptos,
    horas,
    actualizarTabla,
    categoriasEmpleado, // Añade la función de actualización al contexto
  };

  return <TableContext.Provider value={data}>{children}</TableContext.Provider>;
};
