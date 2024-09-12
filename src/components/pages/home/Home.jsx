import Cards from "../cards/Cards";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import Obra from "../obra/Obra";
import CardNew from "../cards/CardNew";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Modal } from "@mui/material";
import ModalObra from "./ModalObra";
import { DrawerContext } from "../../context/DrawerContext";

export default function Home() {
  const [arrayClientes, setArrayClientes] = useState([]);
  const [arrayObras, setArrayObras] = useState([]);
  const [openObra, setOpenObra] = useState(false);
  const [idObra, setIdObra] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [openModalObra, setOpenModalObra] = useState(false);
  const [actualizarObras, setActualizarObras] = useState(false);

  const { setOpenDrawer, openDrawer } = useContext(DrawerContext);

  useEffect(() => {
    const consultaClientes = async () => {
      try {
        const collectionClientes = collection(db, "clientes");
        const clientesSnapshots = await getDocs(collectionClientes);
        const clientesData = clientesSnapshots.docs.map((client) => ({
          id: client.id,
          ...client.data(),
        }));
        setArrayClientes(clientesData);
        console.log(clientesSnapshots);
        console.log(db);
        console.log(arrayClientes);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    consultaClientes();
  }, [actualizarObras]);

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

  const isMobile = useMediaQuery("(max-width:760px)");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMobile ? "center" : "flex-start",
        width: openDrawer ? "80%" : "100%",
        marginLeft: isMobile ? "0px" : "5rem",
        marginLeft: openDrawer ? "20rem" : "6rem",
      }}
    >
      <ModalObra
        openModalObra={openModalObra}
        idObra={idObra}
        setOpenModalObra={setOpenModalObra}
        setActualizarObras={setActualizarObras}
      />
      {!openObra && (
        <div
          style={{
            width: "90%",
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <CardNew setOpenModalObra={setOpenModalObra} />
          <Cards
            clientes={arrayClientes}
            obras={arrayObras}
            setOpenObra={setOpenObra}
            setIdObra={setIdObra}
            setIdCliente={setIdCliente}
            idCliente={idCliente}
            idObra={idObra}
          />
        </div>
      )}
    </div>
  );
}
