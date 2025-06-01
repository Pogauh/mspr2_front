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
  const [region, setRegion] = useState('');

  const fetchData = async () => {
    if (!start || !end) return alert("Veuillez choisir une plage de dates.");
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/epidemiologie/date-range-region/', {
        params: { start, end, region }
      });
      setData(res.data);
      onDataLoaded(res.data);
    } catch (e) {
      console.error("Erreur API", e);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto px-4 py-6">
        {/* Filtres */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-sm font-medium mb-1">Date de début</label>
            <input
                id="start-date"
                type="date"
                value={start}
                onChange={e => setStart(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-sm font-medium mb-1">Date de fin</label>
            <input
                id="end-date"
                type="date"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="region" className="text-sm font-medium mb-1">Pays / Région</label>
            <input
                id="region"
                type="text"
                value={region}
                onChange={e => setRegion(e.target.value)}
                placeholder="ex: France"
                className="border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
          <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rechercher
          </button>
        </div>

        {/* Table scrollable */}
        <div className="overflow-auto max-h-[300px] border rounded-lg shadow">
          <table className="min-w-[800px] w-full text-sm text-left text-gray-800 bg-white">
            <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Région</th>
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
                  <td colSpan={8} className="text-center py-6 text-gray-500">Chargement...</td>
                </tr>
            ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">Aucune donnée trouvée</td>
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
