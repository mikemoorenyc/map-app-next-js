'use client'

import { DataContextProvider } from "@/app/contexts/DataContext";
import { ActiveContextProvider } from "@/app/contexts/ActiveContext";
import { ModalProvider } from "@/app/contexts/ModalContext";
import { ToastContextProvider } from "@/app/contexts/ToastContext";
import LayerPanel from "./LayerPanel";
import {  LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";


import MapPanel from "./MapPanel";
import Toasts from "@/app/components/Toasts";
import { memo } from "react";
import { TUser } from "@/projectTypes";

const MapMemo = memo(MapPanel);
const LayerPanelMemo = memo(LayerPanel);
const ToastsMemo = memo(Toasts);
const liveBlocksKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY


const Composer = function({user,serverId}:{user:TUser,serverId:string}) {
  if(!liveBlocksKey||!user) return false; 


  return(
    <LiveblocksProvider authEndpoint={async ()=> {
      const response = await fetch("/api/liveblocks-auth",{
        method:"POST",
        headers: {
           "Content-Type": "application/json",
        },
        body: JSON.stringify({user})
      });
      return await response.json(); 

    }}>
    <RoomProvider initialPresence={{ email:"",name:"",color:"",isEditing:false}} id={`maps:${serverId}`}>
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
    </RoomProvider>
    </LiveblocksProvider>

  ) 
}

export default Composer;  
