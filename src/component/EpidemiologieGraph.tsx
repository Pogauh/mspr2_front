import { useEffect, useState } from 'react';

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface DataRow {
    date_jour: string;
    nbr_cas: number;
    nbr_morts: number;
    nbr_hospitalises: number;
}

interface Props {
    data: DataRow[];
}

export default function EpidemiologieGraph({ data }: Props) {
    const [showCas, setShowCas] = useState(true);
    const [showMorts, setShowMorts] = useState(true);
    const [showHospitalisations, setShowHospitalisations] = useState(true);

    if (data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">Évolution des indicateurs</h2>

            <div className="flex gap-4 mb-4">
                <label><input type="checkbox" checked={showCas} onChange={() => setShowCas(!showCas)} /> Cas</label>
                <label><input type="checkbox" checked={showMorts} onChange={() => setShowMorts(!showMorts)} /> Morts</label>
                <label><input type="checkbox" checked={showHospitalisations} onChange={() => setShowHospitalisations(!showHospitalisations)} /> Hospitalisations</label>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date_jour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {showCas && <Line type="monotone" dataKey="nbr_cas" stroke="#8884d8" name="Cas" />}
                    {showMorts && <Line type="monotone" dataKey="nbr_morts" stroke="#e74c3c" name="Morts" />}
                    {showHospitalisations && <Line type="monotone" dataKey="nbr_hospitalises" stroke="#2ecc71" name="Hospitalisations" />}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
