import { TUser } from "@/projectTypes";
import {  LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

export default function LiveBlocksContainer({user,serverId,children}:{user:TUser,serverId:string,children:ReactNode}) {
  
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
        {children}
      </RoomProvider>
    
    
    </LiveblocksProvider>
  )
}