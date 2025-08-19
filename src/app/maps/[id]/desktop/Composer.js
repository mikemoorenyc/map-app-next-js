

import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import { ModalProvider } from "@/app/contexts/ModalContext";
import { ToastContextProvider } from "@/app/contexts/ToastContext";
import LayerPanel from "./LayerPanel";

import MapPanel from "./MapPanel";
import Toasts from "@/app/components/Toasts";
import { memo } from "react";

const MapMemo = memo(MapPanel);
const LayerPanelMemo = memo(LayerPanel);
const ToastsMemo = memo(Toasts);

const Composer = function({mapData,user,serverId}) {

  return <ModalProvider><ToastContextProvider><DataContextProvider user={user} serverId={serverId}>
  <ActiveContextProvider mapData={mapData}>
    <LayerPanelMemo />
    <MapMemo />
   <ToastsMemo />
  

</ActiveContextProvider>

  </DataContextProvider></ToastContextProvider></ModalProvider>
}

export default Composer;  