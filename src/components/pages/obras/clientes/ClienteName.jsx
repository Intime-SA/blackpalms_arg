import React, { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ClienteName = ({ clienteId }) => {
  const [clienteName, setClienteName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClienteName = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "clientes", clienteId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClienteName(docSnap.data().nombre); // Suponiendo que el nombre del cliente está en el campo 'name'
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClienteName();
  }, [clienteId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{clienteName}</div>;
};

export default ClienteName;
