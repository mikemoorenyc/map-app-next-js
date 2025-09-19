'use client'
import { DataContextProvider } from "@/app/contexts/DataContext"
import { MobileActiveContextProvider } from "@/app/contexts/MobileActiveContext"
import MapPanel from "./MapPanel"
import "./styles.css";
import { useEffect } from "react";

import { memo} from "react";
import { ModalProvider } from "@/app/contexts/ModalContext";

import { TUser } from "@/projectTypes";
import LiveBlocksContainer from "@/app/components/LiveBlocksContainer/LiveBlocksContainer";

type TProps = {
  serverId:string,
  user:TUser,
}
const MapPanelMemo = memo(MapPanel);


const Mobile = ({serverId,user}:TProps) => {
  if(!serverId||!user) return false; 

useEffect(()=> {
  localStorage.setItem("last-viewed",window.location.href.toLowerCase());
},[])


return (<>
<LiveBlocksContainer {...{serverId,user}}>

<ModalProvider>
<DataContextProvider serverId={serverId} user={user}>
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