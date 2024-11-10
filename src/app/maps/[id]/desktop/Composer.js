
import { DataContextProvider } from "@/app/contexts/DataContext";
import LayerPanel from "./LayerPanel";



const Composer = function({mapData}) {

  return <DataContextProvider mapData={mapData}>
    <LayerPanel />


  </DataContextProvider>
}

export default Composer; 