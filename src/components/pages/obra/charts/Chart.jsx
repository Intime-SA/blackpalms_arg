import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { TableContext } from "../../../context/TableContext";

export default function Chart({ idObra, cambioGastos, setCambioGastos }) {
  const [gastos, setGastos] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);

  const { categorias } = React.useContext(TableContext);

  // Función para obtener el nombre de la categoría dado su ID
  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find((cat) => cat.id === idCategoria);
    return categoria ? categoria.nombre : "Desconocida";
  };

  React.useEffect(() => {
    const consultaObra = async () => {
      try {
        const obraRef = collection(db, "gastos");
        const obraSnapshot = await getDocs(obraRef);
        let arrayGastosObra = [];
        obraSnapshot.forEach((element) => {
          if (element.data().obraId === idObra)
            arrayGastosObra.push(element.data());
        });

        setGastos(arrayGastosObra);

        // Calcular totales por categoría
        const categoriasTotales = {};
        arrayGastosObra.forEach((gasto) => {
          if (gasto.categoria in categoriasTotales) {
            categoriasTotales[gasto.categoria] += gasto.montoTotal;
          } else {
            categoriasTotales[gasto.categoria] = gasto.montoTotal;
          }
        });

        // Convertir los totales en el formato requerido para el gráfico de torta
        const chartData = Object.keys(categoriasTotales).map(
          (categoriaId, index) => ({
            id: index,
            value: categoriasTotales[categoriaId],
            label: getNombreCategoria(categoriaId), // Obtener el nombre de la categoría
          })
        );

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching Obra:", error);
      }
    };

    consultaObra();
    setCambioGastos(false);
  }, [idObra, cambioGastos, categorias]);

  return <PieChart series={[{ data: chartData }]} width={450} height={200} />;
}
