

import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import { ToastContextProvider } from "@/app/contexts/ToastContext";
import LayerPanel from "./LayerPanel";
import TopMenu from "./TopMenu";
import MapPanel from "./MapPanel";
import Toasts from "@/app/components/Toasts";



const Composer = function({mapData}) {

  return <ToastContextProvider><DataContextProvider mapData={mapData}>
  <ActiveContextProvider mapData={mapData}>
    <LayerPanel />
    <MapPanel />
   <Toasts />
  <TopMenu />

</ActiveContextProvider>

  </DataContextProvider></ToastContextProvider>
}

export default Composer;  