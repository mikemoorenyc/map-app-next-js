
import { ModalProvider } from "@/_contexts/ModalContext";
import { ToastContextProvider } from "@/_contexts/ToastContext";
import LayerPanel from "./LayerPanel";
import LiveBlocksContainer from "@/_components/LiveBlocksContainer/LiveBlocksContainer";
import { DataStoreProvider } from "@/_contexts/useDataStore";

import MapPanel from "./MapPanel";
import Toasts from "@/_components/Toasts";
import { memo, useEffect } from "react";
import { TMap, TUser } from "@/projectTypes";



const MapMemo = memo(MapPanel);
const LayerPanelMemo = memo(LayerPanel);
const ToastsMemo = memo(Toasts);



const Composer = function({serverId,map,staticMode}:{serverId:string,map:TMap,staticMode:boolean}) {
  if(!serverId) return false; 

  
  const {mapIcon, layerData,title} = map; 
  const pinsFlat = layerData.flatMap(l => {
    if(!l.pins) {
      return [];
    }
    return l.pins
  })
  const pinIds = pinsFlat.map(p => p.id);
  const init = {
    mapIcon,layerData,
    title,
    pinIds,
    pinsFlat,
    mapId:map.id
  
  }


  return(
    <LiveBlocksContainer {...{serverId} } defaultData={{
      layerData:map.layerData,
      pageTitle:map.title,
      mapIcon:map.mapIcon||""
    }}>
    <DataStoreProvider {...{init}}>
    <ModalProvider>
    <ToastContextProvider>

      <>

        <LayerPanelMemo />
        <MapMemo />
        <ToastsMemo />
        
      </>
   
    </ToastContextProvider>
    </ModalProvider>
    </DataStoreProvider>
    </LiveBlocksContainer>

  ) 
}

export default Composer;  
