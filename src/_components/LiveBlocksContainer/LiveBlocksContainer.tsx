"use client"
import { LiveObject } from "@liveblocks/client";
import {  ClientSideSuspense, LiveblocksProvider, RoomProvider ,useMyPresence} from "@liveblocks/react/suspense";
import { ReactNode, useContext, useEffect } from "react";
import { useSession, SessionProvider } from 'next-auth/react'
import DataContext from "@/_contexts/DataContext";
import { TLayer } from "@/projectTypes";

 function LiveBlocks({serverId,children,defaultData}:{serverId:string,children:ReactNode,defaultData: {
  pageTitle:string, 
  layerData:TLayer[],
  mapIcon?:string
 }}) {
  const session = useSession();
  const {updateUser} = useContext(DataContext);
  if(!session.data) return; 

  const author = async ()=> {
    if(!session) return ;
      const response = await fetch("/api/liveblocks-auth",{
        method:"POST",
        headers: {
           "Content-Type": "application/json",
        },
        body: JSON.stringify({user:session.data?.user})
      });
      return await response.json(); 

  }
  
  return(
    
    <LiveblocksProvider throttle={1000} authEndpoint={author}>
      <RoomProvider initialStorage={{
        map : new LiveObject({
          pageTitle:defaultData.pageTitle,
          layerData:defaultData.layerData,
          mapIcon:defaultData?.mapIcon||""
        })
      }
        
      }  initialPresence={{isVisible:true, email:"",name:"",color:"",isEditing:false,savingDuties:false}} id={`maps:${serverId}`}>
         <ClientSideSuspense fallback={<></>}><PresenceUpdater /></ClientSideSuspense>
        {children}
      </RoomProvider>
    
    
    </LiveblocksProvider>
 )
}

const PresenceUpdater = () => {
  const [myPresence, updateMyPresence] = useMyPresence();
  const session = useSession();
  

  useEffect(()=> {
    if(!session||!myPresence||!updateMyPresence) return ; 
    if(myPresence.email) return ; 
    if(!session.data) return ; 
    const email = session.data.user?.email
    const name = session.data.user?.name
    if(!name || !email) return ; 
    updateMyPresence({
      email,name
    })

  },[session,myPresence,updateMyPresence])
  
  
  return <></>
}
export default function LiveBlocksContainer({serverId,children,defaultData}:{serverId:string,children:ReactNode,defaultData:{
  pageTitle:string,
  mapIcon?:string, 
  layerData:TLayer[]
}}) {
  return <SessionProvider>
   
    <LiveBlocks {...{serverId,defaultData}}>{children}</LiveBlocks>
  </SessionProvider>

}