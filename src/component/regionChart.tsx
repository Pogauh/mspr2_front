import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface DataPoint {
    date_jour: string;
    nbr_cas: number;
    nbr_hospitalises: number;
    nbr_morts: number;
}

interface Props {
    data: DataPoint[];
}

export default function InteractiveRegionChart({ data }: Props) {
    const [showCases, setShowCases] = useState(true);
    const [showHospitalisations, setShowHospitalisations] = useState(true);
    const [showDeaths, setShowDeaths] = useState(false);

    return (
        <div className="bg-white p-6 rounded shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Données épidémiologiques</h2>

            {/* Checkboxes pour activer/désactiver les courbes */}
            <div className="flex justify-center gap-4 mb-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showCases} onChange={() => setShowCases(!showCases)} />
                    <span>Cas</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showHospitalisations} onChange={() => setShowHospitalisations(!showHospitalisations)} />
                    <span>Hospitalisations</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={showDeaths} onChange={() => setShowDeaths(!showDeaths)} />
                    <span>Morts</span>
                </label>
            </div>

            {/* Graphique */}
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date_jour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {showCases && <Line type="monotone" dataKey="nbr_cas" stroke="#3b82f6" name="Cas" />}
                    {showHospitalisations && <Line type="monotone" dataKey="nbr_hospitalises" stroke="#10b981" name="Hospitalisations" />}
                    {showDeaths && <Line type="monotone" dataKey="nbr_morts" stroke="#ef4444" name="Morts" />}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
