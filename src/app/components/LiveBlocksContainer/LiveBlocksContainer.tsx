import { TMap, TUser } from "@/projectTypes";
import { LiveObject } from "@liveblocks/client";
import {  LiveblocksProvider, RoomProvider, useMyPresence } from "@liveblocks/react/suspense";
import { ReactNode, useCallback, useEffect } from "react";
import { useSession, SessionProvider } from 'next-auth/react'


type TProps = {
  map:TMap,
  children:ReactNode,

}
const UserUpdater = () => {
  const session = useSession(); 
  const [prescence,updateMyPrescence] = useMyPresence();
  useEffect(()=> {
    if(session.status!=="authenticated")return ;
    const {user} = session.data;
    if(!user?.name || !user.email) return ; 
    console.log(user.name);
    updateMyPrescence({
      name:user.name,
      email:user.email
    })
  },[])

  return <></>
}
 function LiveBlocksContainer({map,children}:TProps) {

   const session = useSession();

  const authMethod = useCallback(async ()=> {
    if(session.status !== "authenticated" ) return 
 
    const response = await fetch("/api/liveblocks-auth",{
        method:"POST",
        headers: {
           "Content-Type": "application/json",
        },
        body: JSON.stringify({user:session?.data.user})
      });

      
      return await response.json(); 

  },[session])

  
  if(session.status !== "authenticated" ) return 

  return(
    <LiveblocksProvider throttle={1000} authEndpoint={authMethod}>
      <RoomProvider initialStorage={{
        map : new LiveObject({
          pageTitle:map.title,
          layerData:map.layerData,
          mapIcon:map.mapIcon || ""
        })
      }
        
      }  initialPresence={{isVisible:true, email:"",name:"",color:"",isEditing:false,savingDuties:false}} id={`maps:${map.id}`}>
     
        {children}
       
      </RoomProvider>
    
    
    </LiveblocksProvider>
  )
}
export default ({map,children}:{map:TMap,children:ReactNode}) => {
  return  <LiveBlocksContainer {...{map}}>
      {children}
    </LiveBlocksContainer>
 
}
