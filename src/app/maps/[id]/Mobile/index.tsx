'use client'
import { DataContextProvider } from "@/_contexts/DataContext"
import { MobileActiveContextProvider } from "@/_contexts/MobileActiveContext"
import MapPanel from "./MapPanel"
import "./styles.css";
import { useEffect } from "react";

import { memo} from "react";
import { ModalProvider } from "@/_contexts/ModalContext";

import { TMap, TUser } from "@/projectTypes";
import LiveBlocksContainer from "@/_components/LiveBlocksContainer/LiveBlocksContainer";

type TProps = {
  serverId:string,
  map:TMap

}
const MapPanelMemo = memo(MapPanel);


const Mobile = ({serverId,map}:TProps) => {
  if(!serverId) return false; 

useEffect(()=> {
  sessionStorage.setItem("sessionStarted","yes");
  localStorage.setItem("last-viewed",window.location.href.toLowerCase());
},[])


return (<>
<LiveBlocksContainer {...{serverId}}>

<ModalProvider>
<DataContextProvider {...{map,serverId}}>
<MobileActiveContextProvider>

<MapPanelMemo />



</MobileActiveContextProvider>
</DataContextProvider>
</ModalProvider>

</LiveBlocksContainer>
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