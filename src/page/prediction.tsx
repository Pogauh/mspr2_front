import axios from 'axios';
import { useState } from 'react';

export default function Prediction() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://127.0.0.1:8000/epidemiologie/date-range/', {
                params: {
                    start: startDate,
                    end: endDate,
                },
            });
            setData(response.data);
            setError('');  // Clear previous error if any
        } catch (error) {
            setError('Erreur lors du chargement des données');
            setData([]);
        }
    };

    return (
        <div>
            <h1>Données Épidémiologiques</h1>

            {/* Formulaire de saisie des dates */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="startDate">Date de début :</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate">Date de fin :</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Rechercher</button>
            </form>

            {/* Affichage des données ou de l'erreur */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <h2>Résultats :</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}
