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
import { TUser } from "@/projectTypes";

const MapMemo = memo(MapPanel);
const LayerPanelMemo = memo(LayerPanel);
const ToastsMemo = memo(Toasts);



const Composer = function({user,serverId}:{user:TUser,serverId:string}) {
  if(!user||!serverId) return false; 


  return(
    <LiveBlocksContainer {...{user,serverId}}>
    
    <ModalProvider>
    <ToastContextProvider>
    <DataContextProvider user={user} serverId={serverId}>
    <ActiveContextProvider>

        <LayerPanelMemo />
        <MapMemo />
        <ToastsMemo />
 
    </ActiveContextProvider>
    </DataContextProvider>
    </ToastContextProvider>
    </ModalProvider>
    
    </LiveBlocksContainer>

  ) 
}

export default Composer;  
