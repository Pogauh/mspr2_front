import EpidemiologieTable from '../component/epidemiologieTable';
import PredictionForm from "../component/PredictionForm";
import GraphCasPrediction from "../component/graphCasPrediction";
import EpidemiologieGraph from "../component/EpidemiologieGraph";
import {useState} from "react";
import type { DataRow } from '../component/epidemiologieTable';



export default function Home() {
    const [epidemioData, setEpidemioData] = useState<DataRow[]>([]);

    return (
      <div className="space-y-8 p-6">
          <EpidemiologieTable onDataLoaded={setEpidemioData} />
          <EpidemiologieGraph data={epidemioData} />
          <PredictionForm />
      </div>


  );
}
