'use client'
import { DataContextProvider } from "@/app/contexts/DataContext"
import { MobileActiveContextProvider } from "@/app/contexts/MobileActiveContext"
import MapPanel from "./MapPanel"
import "./styles.css";
import DrawerPanel from "./DrawerPanel";
import { memo} from "react";
import { ModalProvider } from "@/app/contexts/ModalContext";

const MapPanelMemo = memo(MapPanel);
const DrawerPanelMemo = memo(DrawerPanel);

const Mobile = ({mapData}) => {

return (<>
<ModalProvider>
<DataContextProvider mapData={mapData}>
<MobileActiveContextProvider mapData={mapData}>

<MapPanelMemo />
<DrawerPanelMemo/>


</MobileActiveContextProvider>
</DataContextProvider>
</ModalProvider>
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