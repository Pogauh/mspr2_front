import { useState } from "react";
import axios from "axios";

interface PredictionFormProps {
    onPredictionComplete?: (data: {
        date: string;
        pays: string;
        region: string;
        cas: string;
        prediction: any;
    }) => void;
}

export default function PredictionForm({ onPredictionComplete }: PredictionFormProps) {
    const [jour, setJour] = useState("");
    const [mois, setMois] = useState("");
    const [annee, setAnnee] = useState("");
    const [pays, setPays] = useState("");
    const [maladie, setMaladie] = useState("1");
    const [cas, setCas] = useState("");
    const [hospitalisation, setHospitalisation] = useState("");
    const [population, setPopulation] = useState("");
    const [type, setType] = useState("morts_light");
    const [prediction, setPrediction] = useState<number | null>(null);
    const [error, setError] = useState<string | string[]>("");

    const [fermetureEcoles, setFermetureEcoles] = useState(0);
    const [evenementsAnnules, setEvenementsAnnules] = useState(0);
    const [restrictionsRassemblement, setRestrictionsRassemblement] = useState(0);
    const [fermetureTransports, setFermetureTransports] = useState(0);
    const [confinement, setConfinement] = useState(0);
    const [deplacementInterne, setDeplacementInterne] = useState(0);
    const [controleVoyage, setControleVoyage] = useState(0);
    const [supportInternational, setSupportInternational] = useState(0);
    const [campagneInfo, setCampagneInfo] = useState(0);
    const [politiqueTest, setPolitiqueTest] = useState(0);
    const [tracageCas, setTracageCas] = useState(0);
    const [investSante, setInvestSante] = useState(0);
    const [investVaccin, setInvestVaccin] = useState(0);
    const [masques, setMasques] = useState(0);
    const [vaccination, setVaccination] = useState(0);
    const [rigueur, setRigueur] = useState(0);
    const [fermetureTravail, setFermetureTravail] = useState(0);




    const handlePredict = async () => {
        if (!jour || !mois || !annee || !pays || !hospitalisation || !population || !cas) {
            setError("Tous les champs sont obligatoires");
            return;
        }

        const dateStr = `${annee}-${mois.padStart(2, "0")}-${jour.padStart(2, "0")}`;

        // Construction du payload principal
        let payload: any = {
            date: dateStr,
            pays: pays,
            nbr_cas: parseInt(cas),
            population_pays: parseInt(population),
        };

        let endpoint = "http://127.0.0.1:8000/predict";

        if (type === "morts_hard") {
            payload = {
                ...payload,
                nbr_hospitalises: parseInt(hospitalisation),
                mesure_confinement: confinement,
                mesure_portmasque: masques,
                mesure_fermetureecole: fermetureEcoles,
                mesure_evenementspublicsannules: evenementsAnnules,
                mesure_restrictionsrassemblement: restrictionsRassemblement,
                mesure_fermeturetransportspublics: fermetureTransports,
                mesure_restrictionsdeplacementsinterne: deplacementInterne,
                mesure_controlevoyageinternational: controleVoyage,
                mesure_supportinternational: supportInternational,
                mesure_campagneinformative: campagneInfo,
                mesure_politiquetest: politiqueTest,
                mesure_tracagecascontacte: tracageCas,
                mesure_investissementsante: investSante,
                mesure_investissementvaccin: investVaccin,
                mesure_vaccination: vaccination,
                mesure_rigueur: rigueur,
                mesure_fermeturezonetravail: fermetureTravail,
            };

            endpoint = "http://127.0.0.1:8000/predict_mort_hard";
        }else{
            payload = {
                ...payload,
                maladie: maladie,
                hospitalisation: parseInt(hospitalisation),
            }
        }
        console.log(payload)
        try {
            const res = await axios.post(endpoint, payload);
            const predictionValue = res.data.prediction;
            setPrediction(predictionValue);
            setError("");

            if (onPredictionComplete) {
                onPredictionComplete({
                    date: dateStr,
                    pays: pays,
                    region: pays,
                    cas: cas,
                    prediction: predictionValue,
                });
            }
        } catch (err: any) {
            setPrediction(null);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                const messages = detail.map((d: any) => d.msg);
                setError(messages);
            } else if (typeof detail === "string") {
                setError(detail);
            } else {
                setError("Erreur lors de la prédiction");
            }
        }
    };

    const handleChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setter(e.target.value);
        setError("");
        setPrediction(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-7xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Faire une prédiction</h2>

            {/* Section : Paramètres généraux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                    <label htmlFor="type-select" className="text-sm font-medium mb-1">Type</label>
                    <select
                        id="type-select"
                        value={type}
                        onChange={handleChange(setType)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="morts_light">Morts (light)</option>
                        <option value="morts_hard">Morts (hard)</option>
                    </select>
                </div>


                {[
                    { id: "jour", label: "Jour", value: jour, setter: setJour, placeholder: "1-31" },
                    { id: "mois", label: "Mois", value: mois, setter: setMois, placeholder: "1-12" },
                    { id: "annee", label: "Année", value: annee, setter: setAnnee, placeholder: "ex: 2021" },
                    { id: "hospitalisation", label: "Hospitalisations", value: hospitalisation, setter: setHospitalisation },
                    { id: "cas", label: "Cas", value: cas, setter: setCas },
                    { id: "population", label: "Population pays", value: population, setter: setPopulation },
                ].map(({ id, label, value, setter, placeholder }, idx) => (
                    <div className="flex flex-col" key={idx}>
                        <label htmlFor={id} className="text-sm font-medium mb-1">{label}</label>
                        <input
                            id={id}
                            type="number"
                            value={value}
                            onChange={handleChange(setter)}
                            placeholder={placeholder}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                ))}



                <div className="flex flex-col">
                    <label htmlFor="pays" className="text-sm font-medium mb-1">Pays</label>
                    <select
                        id="pays"
                        value={pays}
                        onChange={handleChange(setPays)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">-- Choisir un pays --</option>
                        <option value="FR">🇫🇷 France</option>
                        <option value="CH">🇨🇭 Suisse</option>
                        <option value="US">🇺🇸 États-Unis</option>
                    </select>
                </div>
            </div>

            {/* Section : Mesures gouvernementales */}
            {type === "morts_hard" && (
                <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Mesures gouvernementales</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {[
                            { id: "fermetureEcoles", label: "Fermeture des écoles", value: fermetureEcoles, setter: setFermetureEcoles },
                            { id: "evenementsAnnules", label: "Événements publics annulés", value: evenementsAnnules, setter: setEvenementsAnnules },
                            { id: "restrictionsRassemblement", label: "Restrictions rassemblement", value: restrictionsRassemblement, setter: setRestrictionsRassemblement },
                            { id: "fermetureTransports", label: "Fermeture transports publics", value: fermetureTransports, setter: setFermetureTransports },
                            { id: "confinement", label: "Confinement", value: confinement, setter: setConfinement },
                            { id: "deplacementInterne", label: "Restrictions déplacements internes", value: deplacementInterne, setter: setDeplacementInterne },
                            { id: "controleVoyage", label: "Contrôle voyage international", value: controleVoyage, setter: setControleVoyage },
                            { id: "supportInternational", label: "Support international", value: supportInternational, setter: setSupportInternational },
                            { id: "campagneInfo", label: "Campagne informative", value: campagneInfo, setter: setCampagneInfo },
                            { id: "politiqueTest", label: "Politique de test", value: politiqueTest, setter: setPolitiqueTest },
                            { id: "tracageCas", label: "Traçage des cas contacts", value: tracageCas, setter: setTracageCas },
                            { id: "investSante", label: "Investissement santé", value: investSante, setter: setInvestSante },
                            { id: "investVaccin", label: "Investissement vaccin", value: investVaccin, setter: setInvestVaccin },
                            { id: "masques", label: "Port du masque", value: masques, setter: setMasques },
                            { id: "vaccination", label: "Vaccination", value: vaccination, setter: setVaccination },
                            { id: "rigueur", label: "Rigueur des mesures", value: rigueur, setter: setRigueur },
                            { id: "fermetureTravail", label: "Fermeture des zones de travail", value: fermetureTravail, setter: setFermetureTravail },
                        ].map(({ id, label, value, setter }) => (
                            <div className="flex flex-col" key={id}>
                                <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                                <select
                                    id={id}
                                    value={value}
                                    onChange={(e) => setter(parseInt(e.target.value))}
                                    className="border p-2 rounded text-sm"
                                >
                                    {[0, 1, 2, 3, 4].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8">
                <button
                    onClick={handlePredict}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                >
                    Prédire
                </button>
            </div>

            {prediction !== null && (
                <div className="mt-6 text-green-600 font-semibold text-lg">Résultat : {prediction}</div>
            )}

            {error && (
                <div className="mt-4 text-red-600">
                    {Array.isArray(error) ? (
                        <ul className="list-disc ml-5 space-y-1">
                            {error.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
