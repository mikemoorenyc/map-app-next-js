'use client'
import { DataContextProvider } from "@/app/contexts/DataContext"
import { MobileActiveContextProvider } from "@/app/contexts/MobileActiveContext"
import MapPanel from "./MapPanel"
import "./styles.css";
import { useEffect } from "react";

import { memo} from "react";
import { ModalProvider } from "@/app/contexts/ModalContext";
import {  LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { TUser } from "@/projectTypes";

type TProps = {
  serverId:string,
  user:TUser,
}
const MapPanelMemo = memo(MapPanel);


const Mobile = ({serverId,user}:TProps) => {
  if(!process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY) return false; 
  console.log(serverId);
useEffect(()=> {
  localStorage.setItem("last-viewed",window.location.href.toLowerCase());
},[])


return (<>
<LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY}>
    <RoomProvider initialPresence={{ email:"",name:"",color:"",isEditing:false}}  id={serverId}>
<ModalProvider>
<DataContextProvider serverId={serverId} user={user}>
<MobileActiveContextProvider>

<MapPanelMemo />



</MobileActiveContextProvider>
</DataContextProvider>
</ModalProvider>
</RoomProvider>
</LiveblocksProvider>
<style jsx global>{`

.GeoTag {
  font-size: 16px;
  display: block;
  will-change:transform;
  text-shadow: 1px 1px 0 black;
}

.mobile-app .gm-title {
  color:black;
}
html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  height: 100%;
  overflow-y:hidden;
}




`}

</style>
</>)


}

export default Mobile; 