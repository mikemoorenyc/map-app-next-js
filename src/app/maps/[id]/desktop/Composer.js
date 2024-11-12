
import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import LayerPanel from "./LayerPanel";



const Composer = function({mapData}) {

  return <DataContextProvider mapData={mapData}>
  <ActiveContextProvider mapData={mapData}>
    <LayerPanel />
</ActiveContextProvider>

  </DataContextProvider>
}

export default Composer; 