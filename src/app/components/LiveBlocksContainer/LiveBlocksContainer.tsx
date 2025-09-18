import { TUser } from "@/projectTypes";
import { LiveObject } from "@liveblocks/client";
import {  LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export default function LiveBlocksContainer({user,serverId,children}:{user:TUser,serverId:string,children:ReactNode}) {
  
  return(
    <LiveblocksProvider throttle={500} authEndpoint={async ()=> {
      const response = await fetch("/api/liveblocks-auth",{
        method:"POST",
        headers: {
           "Content-Type": "application/json",
        },
        body: JSON.stringify({user})
      });
      return await response.json(); 

    }}>
      <RoomProvider initialStorage={{
        map : new LiveObject({
          pageTitle:"",
          layerData:[],
          mapIcon:""
        })
      }
        
      }  initialPresence={{isVisible:true, email:"",name:"",color:"",isEditing:false,savingDuties:false}} id={`maps:${serverId}`}>
        {children}
      </RoomProvider>
    
    
    </LiveblocksProvider>
  )
}
