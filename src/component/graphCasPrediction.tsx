import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { date: '2021-01-01', cases: 20, predicted: 22 },
    { date: '2021-01-02', cases: 50, predicted: 47 },
    // ...
];

export default function GraphCasPrediction() {
    return (
        <div className="p-4 bg-white shadow rounded">
        <h2 className="text-xl mb-4">Évolution des cas et prédictions</h2>
    <LineChart width={800} height={300} data={data}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="cases" stroke="#8884d8" name="Cas réels" />
    <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Prédiction" />
        </LineChart>
        </div>
);
}
