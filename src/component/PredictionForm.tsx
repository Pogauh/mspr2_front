import { useState } from 'react';
import axios from 'axios';

export default function PredictionForm() {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [population, setPopulation] = useState('');
    const [region, setRegion] = useState('');
    const [type, setType] = useState('cas'); // "cas", "morts", "hospitalisations"
    const [prediction, setPrediction] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handlePredict = async () => {
        if (!day || !month || !year || !population || !region) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        try {
            const res = await axios.post(`http://127.0.0.1:8000/predict?type=${type}`, {
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                population: parseInt(population),
                region: region
            });
            setPrediction(res.data.prediction);
            setError('');
        } catch (err: any) {
            setPrediction(null);
            setError(err.response?.data?.detail || 'Erreur lors de la prédiction');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-7xl mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">Faire une prédiction</h2>
            <div className="flex flex-wrap gap-6 items-end">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded w-40">
                        <option value="cas">Cas</option>
                        <option value="morts">Morts</option>
                        <option value="hospitalisations">Hospitalisations</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Jour</label>
                    <input type="number" value={day} onChange={e => setDay(e.target.value)} className="border p-2 rounded w-28" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Mois</label>
                    <input type="number" value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded w-28" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Année</label>
                    <input type="number" value={year} onChange={e => setYear(e.target.value)} className="border p-2 rounded w-32" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Population</label>
                    <input type="number" value={population} onChange={e => setPopulation(e.target.value)} className="border p-2 rounded w-36" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Région</label>
                    <input type="text" value={region} onChange={e => setRegion(e.target.value)} className="border p-2 rounded w-48" placeholder="ex: France" />
                </div>
                <div className="flex flex-col mt-6">
                    <button onClick={handlePredict} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Prédire</button>
                </div>
            </div>

            {prediction !== null && (
                <div className="mt-4 text-green-600 font-bold">
                    Résultat : {prediction}
                </div>
            )}
            {error && (
                <div className="mt-4 text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
}