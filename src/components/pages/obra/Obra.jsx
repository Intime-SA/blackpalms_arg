import React, { useEffect, useState } from "react";
import ListEmpleado from "./listEmpleado/ListEmpleado";
import Dashboard from "./dashboard/Dashboard";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

const Obra = () => {
  const [arrayClientes, setArrayClientes] = useState([]);
  const [arrayObras, setArrayObras] = useState([]);

  const { id } = useParams(); // Obtener el parámetro "id" de la URL

  console.log(id);

  useEffect(() => {
    const consultaObras = async () => {
      try {
        const collectionObras = collection(db, "obras");
        const obrasSnapshot = await getDocs(collectionObras);
        const obrasData = obrasSnapshot.docs.map((obra) => ({
          id: obra.id,
          ...obra.data(),
        }));
        setArrayObras(obrasData);
      } catch (error) {
        console.error("Error fetching obras:", error);
      }
    };

    consultaObras();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Dashboard idObra={id} obras={arrayObras} />
    </div>
  );
};

export default Obra;
