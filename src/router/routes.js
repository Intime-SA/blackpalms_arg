import AdministracionAjustes from "../components/pages/administracion/AdministracionAjustes";
import AdministracionCategorias from "../components/pages/administracionCategorias/AdministracionCategorias";
import FormularioCategoria from "../components/pages/administracionCategorias/FormularioCategoria";
import NuevaCategoria from "../components/pages/administracionCategorias/NuevaCategoria";
import Categorias from "../components/pages/categorias/Categorias";
import ClientForm from "../components/pages/clients/ClientForm";
import Clients from "../components/pages/clients/Clients";
import EditFormCliente from "../components/pages/clients/EditFormCliente";
import Compras from "../components/pages/compras/Compras";
import Conceptos from "../components/pages/conceptos/Conceptos";
import AgregarCuenta from "../components/pages/cuentas/AgregarCuenta";
import CuentaCliente from "../components/pages/cuentas/CuentaCliente";
import CuentaMovimientos from "../components/pages/cuentas/CuentaMovimientos";
import CuentaProveedor from "../components/pages/cuentas/CuentaProveedor";
import Cuentas from "../components/pages/cuentas/Cuentas";
import Egresos from "../components/pages/egresos/Egresos";
import AgregarEmpleado from "../components/pages/empleados/AgregarEmpleados";
import EditarEmpleado from "../components/pages/empleados/EditarEmpleado";
import Empleados from "../components/pages/empleados/Empleados";
import HorasGlobalesPage from "../components/pages/empleados/HorasGlobalesPage";
import GastosObraPage from "../components/pages/gastos/GastosObraPage";
import Home from "../components/pages/home/Home";
import GastosHorasPage from "../components/pages/horas/GastosHorasPage";
import Ingresos from "../components/pages/ingresos/Ingresos";
import Obra from "../components/pages/obra/Obra";
import Obras from "../components/pages/obras/Obras";
import Proveedores from "../components/pages/proveedores/Proveedores";
import Reportes from "../components/pages/reportes/Reportes";
import Ventas from "../components/pages/ventas/Ventas";

export const routes = [
  {
    id: "home",
    path: "/",
    Element: Home,
  },
  {
    id: "obra",
    path: "/obra/:id",
    Element: Obra,
  },
  {
    id: "clientes",
    path: "/clientes",
    Element: Clients,
  },
  {
    id: "editFormCliente",
    path: "clientes/editFormCliente/:id",
    Element: EditFormCliente,
  },
  {
    id: "proveedores",
    path: "/proveedores",
    Element: Proveedores,
  },
  {
    id: "categorias",
    path: "/categorias",
    Element: Categorias,
  },
  {
    id: "conceptos",
    path: "/conceptos",
    Element: Conceptos,
  },
  {
    id: "obras",
    path: "/obras",
    Element: Obras,
  },
  {
    id: "gastosObraPage",
    path: "/gastosObraPage/:id",
    Element: GastosObraPage,
  },
  {
    id: "gastosHorasPage",
    path: "/gastosHorasPage/:id",
    Element: GastosHorasPage,
  },
  {
    id: "horasGlobalesPage",
    path: "/horasGlobalesPage/:id",
    Element: HorasGlobalesPage,
  },
  {
    id: "compras",
    path: "/compras",
    Element: Compras,
  },
  {
    id: "ventas",
    path: "/ventas",
    Element: Ventas,
  },
  {
    id: "ingresos",
    path: "/ingresos",
    Element: Ingresos,
  },
  {
    id: "egresos",
    path: "/egresos",
    Element: Egresos,
  },
  {
    id: "cuentasBanco",
    path: "/cuentasBanco",
    Element: Cuentas,
  },
  {
    id: "cuentaProveedor",
    path: "proveedores/cuentaProveedor/:id",
    Element: CuentaProveedor,
  },
  {
    id: "cuentaCliente",
    path: "clientes/cuentaCliente/:id",
    Element: CuentaCliente,
  },
  {
    id: "cuentaMovimientos",
    path: "cuentasBanco/cuentaMovimientos/:id",
    Element: CuentaMovimientos,
  },
  {
    id: "agregarCuenta",
    path: "cuentasBanco/agregarCuenta",
    Element: AgregarCuenta,
  },
  {
    id: "reportes",
    path: "/reportes",
    Element: Reportes,
  },
  {
    id: "empleados",
    path: "/empleados",
    Element: Empleados,
  },
  {
    id: "empleadosEdit",
    path: "/empleadosEdit/:id",
    Element: EditarEmpleado,
  },
  {
    id: "agregarEmpleado",
    path: "/agregarEmpleado",
    Element: AgregarEmpleado,
  },
  {
    id: "administracionAjustes",
    path: "/administracionAjustes",
    Element: AdministracionAjustes,
  },
  {
    id: "administracionCategorias",
    path: "/administracionCategorias",
    Element: AdministracionCategorias,
  },
  {
    id: "formularioCategoria",
    path: "/formularioCategoria",
    Element: NuevaCategoria,
  },
];
