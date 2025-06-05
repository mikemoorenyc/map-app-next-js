

import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import { ModalProvider } from "@/app/contexts/ModalContext";
import { ToastContextProvider } from "@/app/contexts/ToastContext";
import LayerPanel from "./LayerPanel";
import TopMenu from "./TopMenu";
import MapPanel from "./MapPanel";
import Toasts from "@/app/components/Toasts";



const Composer = function({mapData}) {

  return <ModalProvider><ToastContextProvider><DataContextProvider mapData={mapData}>
  <ActiveContextProvider mapData={mapData}>
    <LayerPanel />
    <MapPanel />
   <Toasts />
  <TopMenu />

</ActiveContextProvider>

  </DataContextProvider></ToastContextProvider></ModalProvider>
}

export default Composer;  