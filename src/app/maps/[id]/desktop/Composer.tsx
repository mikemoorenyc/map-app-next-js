'use client'

import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import { ModalProvider } from "@/app/contexts/ModalContext";
import { ToastContextProvider } from "@/app/contexts/ToastContext";
import LayerPanel from "./LayerPanel";
import LiveBlocksContainer from "@/app/components/LiveBlocksContainer/LiveBlocksContainer";


import MapPanel from "./MapPanel";
import Toasts from "@/app/components/Toasts";
import { memo } from "react";
import { TMap, TUser } from "@/projectTypes";
import { SessionProvider } from "next-auth/react";

const MapMemo = memo(MapPanel);
const LayerPanelMemo = memo(LayerPanel);
const ToastsMemo = memo(Toasts);

type TProps = {
  serverId:string, 
  map: TMap
}
const Composer = function({map,serverId}:TProps) {
  if(!serverId) return false; 


  return(
    <SessionProvider>
    <LiveBlocksContainer {...{map,serverId}}>
    
    <ModalProvider>
    <ToastContextProvider>

    <ActiveContextProvider>

        <LayerPanelMemo />
        <MapMemo />
        <ToastsMemo />
 
    </ActiveContextProvider>

    </ToastContextProvider>
    </ModalProvider>
    
    </LiveBlocksContainer>
    </SessionProvider>
  ) 
}

export default Composer;  
