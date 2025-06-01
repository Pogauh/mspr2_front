import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Props {
    date: string;
    pays: string;
    region: string;
    prediction: number;
}

export default function PredictionChart({ date, pays, region, prediction }: Props) {
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dateObj = dayjs(date);
                const start = dateObj.subtract(7, 'day').format('YYYY-MM-DD');
                const end = dateObj.add(7, 'day').format('YYYY-MM-DD');

                let regionToSend = region;
                if (region === "FR") regionToSend = "France";
                if (region === "CH") regionToSend = "Switzerland";
                if (region === "US") regionToSend = "United States of America";

                const res = await axios.get('http://127.0.0.1:8000/epidemiologie/date-range-region/', {
                    params: { start, end, pays,  region: regionToSend }
                });

                const sorted = [...res.data].sort((a, b) =>
                    dayjs(a.date_jour).unix() - dayjs(b.date_jour).unix()
                );

                const labels: string[] = [];
                const deaths: number[] = [];
                const predictions: (number | null)[] = [];

                sorted.forEach((entry) => {
                    const formattedDate = dayjs(entry.date_jour).format('YYYY-MM-DD');
                    labels.push(formattedDate);
                    deaths.push(entry.nbr_morts ?? 0);
                    predictions.push(formattedDate === date ? prediction : null);
                });


                const chartDataset = {
                    labels,
                    datasets: [
                        {
                            label: 'Décès réels',
                            data: deaths,
                            borderColor: '#007bff',
                            backgroundColor: 'transparent',
                            tension: 0.3
                        },
                        {
                            label: 'Prédiction',
                            data: predictions,
                            borderColor: 'orange',
                            backgroundColor: 'orange',
                            pointRadius: 6,
                            showLine: false
                        }
                    ]
                };

                setChartData(chartDataset);
            } catch (err) {
                console.error(err);
                setError("Erreur lors de la récupération des données épidémiologiques.");
            }
        };

        if (date && pays && region && prediction !== null) {
            fetchData();
        }
    }, [date, pays, region, prediction]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">Décès réels + prédiction</h2>
            {error && <p className="text-red-600">{error}</p>}
            {chartData && <Line data={chartData} />}
        </div>
    );
}
