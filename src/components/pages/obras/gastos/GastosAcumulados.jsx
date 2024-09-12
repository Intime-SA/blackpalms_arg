import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useEffect, useState } from "react";
import React from "react";

const GastosAcumulados = ({ obraId }) => {
  const [gastosAcumulados, setGastosAcumulados] = useState(0);
  const [loading, setLoading] = useState(true);

  console.log(obraId);

  useEffect(() => {
    const fetchGastos = async () => {
      setLoading(true);
      try {
        const gastosRef = collection(db, "gastos");
        const q = query(gastosRef, where("obraId", "==", obraId));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);

        let totalGastos = 0;
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          totalGastos += doc.data().montoTotal; // Suponiendo que el gasto está en el campo 'monto'
        });

        setGastosAcumulados(totalGastos);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, [obraId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const formattedGastos = gastosAcumulados.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <div style={{ width: "100%", textAlign: "right" }}>{formattedGastos}</div>
  );
};

export default GastosAcumulados;
