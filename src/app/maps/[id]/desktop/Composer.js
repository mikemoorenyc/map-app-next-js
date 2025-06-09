

import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import { ModalProvider } from "@/app/contexts/ModalContext";
import { ToastContextProvider } from "@/app/contexts/ToastContext";
import LayerPanel from "./LayerPanel";
import TopMenu from "./TopMenu";
import MapPanel from "./MapPanel";
import Toasts from "@/app/components/Toasts";
import { memo } from "react";

const MapMemo = memo(MapPanel);
const LayerPanelMemo = memo(LayerPanel);
const ToastsMemo = memo(Toasts);
const TopMenuMemo = memo(TopMenu); 
const Composer = function({mapData}) {

  return <ModalProvider><ToastContextProvider><DataContextProvider mapData={mapData}>
  <ActiveContextProvider mapData={mapData}>
    <LayerPanelMemo />
    <MapMemo />
   <ToastsMemo />
  <TopMenuMemo />

</ActiveContextProvider>

  </DataContextProvider></ToastContextProvider></ModalProvider>
}

export default Composer;  