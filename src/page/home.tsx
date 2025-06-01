import EpidemiologieTable from '../component/epidemiologieTable';
import PredictionForm from "../component/PredictionForm";
import EpidemiologieGraph from "../component/EpidemiologieGraph";
import {useState} from "react";
import type { DataRow } from '../component/epidemiologieTable';
import PredictionChart from "../component/MortGraph";



export default function Home() {
    const [epidemioData, setEpidemioData] = useState<DataRow[]>([]);
    const [predictionMeta, setPredictionMeta] = useState<{
        date: string;
        pays: string;
        region: string;
        prediction: number;
    } | null>(null);


    return (
      <div className="space-y-8 p-6">
          <EpidemiologieTable onDataLoaded={setEpidemioData} />
          <EpidemiologieGraph data={epidemioData} />
          <PredictionForm onPredictionComplete={setPredictionMeta} />
          {predictionMeta && (
              <PredictionChart
                  date={predictionMeta.date}
                  pays={predictionMeta.pays}
                  region={predictionMeta.region}
                  prediction={predictionMeta.prediction}
              />
          )}
      </div>


  );
}
