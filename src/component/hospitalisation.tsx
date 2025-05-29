import React, { useEffect, useState } from "react";
import axios from "axios";

interface HospitalisationEntry {
  date_jour: string;
  location_key: string;
  population: number;
  nbr_hospitalises: number;
}

function HospitalisationData() {
  const [data, setData] = useState<HospitalisationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<HospitalisationEntry[]>("http://127.0.0.1:8000/epidemiologie")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Données d’hospitalisation</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Région</th>
            <th>Population</th>
            <th>Hospitalisations</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date_jour}</td>
              <td>{entry.location_key}</td>
              <td>{entry.population}</td>
              <td>{entry.nbr_hospitalises}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HospitalisationData;
