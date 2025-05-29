import { useState } from 'react';
import axios from 'axios';
import { CalendarDays } from 'lucide-react';

export interface DataRow {
  date_jour: string;
  region: string;
  population: number;
  nbr_cas: number;
  nbr_morts: number;
  morts_cumule: number;
  nbr_hospitalises: number;
  contamination_cumule: number;
}
interface Props {
  onDataLoaded: (data: DataRow[]) => void;
}

export default function EpidemiologieTable({ onDataLoaded }: Props) {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [region, setRegion] = useState('');  // Ajout de l'état pour la région

  const fetchData = async () => {
    if (!start || !end) return alert("Veuillez choisir une plage de dates.");
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/epidemiologie/date-range-region', {
        params: { start, end, region }  // Ajout du paramètre 'region'
      });
      setData(res.data);
    } catch (e) {
      console.error("Erreur API", e);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto px-4 py-6">
        {/* Sélection de date et région */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-blue-500" />
            <input
                type="date"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="text-blue-500" />
            <input
                type="date"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="region" className="text-sm text-gray-700">Pays/Région</label>
            <input
                type="text"
                id="region"
                value={region}
                onChange={e => setRegion(e.target.value)}
                placeholder="Entrez un pays ou une région"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </div>

        {/* Tableau des données */}
        <div className="overflow-auto rounded-lg shadow-md">
          <table className="w-full table-auto text-sm text-left text-gray-700 bg-white">
            <thead className="bg-blue-50 text-blue-800 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Pays/Région</th>
              <th className="px-6 py-3">Population</th>
              <th className="px-6 py-3">Cas</th>
              <th className="px-6 py-3">Morts</th>
              <th className="px-6 py-3">Morts cumulés</th>
              <th className="px-6 py-3">Hospitalisés</th>
              <th className="px-6 py-3">Cas cumulés</th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">Chargement...</td>
                </tr>
            ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">Aucune donnée</td>
                </tr>
            ) : (
                data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 border-b">
                      <td className="px-6 py-4">{row.date_jour}</td>
                      <td className="px-6 py-4">{row.region.trim()}</td>
                      <td className="px-6 py-4">{row.population}</td>
                      <td className="px-6 py-4">{row.nbr_cas}</td>
                      <td className="px-6 py-4">{row.nbr_morts}</td>
                      <td className="px-6 py-4">{row.morts_cumule}</td>
                      <td className="px-6 py-4">{row.nbr_hospitalises}</td>
                      <td className="px-6 py-4">{row.contamination_cumule}</td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
}
