'use client'
import { DataContextProvider } from "@/app/contexts/DataContext"
import { MobileActiveContextProvider } from "@/app/contexts/MobileActiveContext"
import MapPanel from "./MapPanel"
import "./styles.css";
import DrawerPanel from "./DrawerPanel";


const Mobile = ({mapData}) => {

return (
<DataContextProvider mapData={mapData}>
<MobileActiveContextProvider mapData={mapData}>
<MapPanel />
<DrawerPanel />
<style jsx global>{`

.GeoTag {
  font-size: 16px;
  display: block;
  will-change:transform;
  text-shadow: 1px 1px 0 black;
}
.mobile-app {
  background:black; 
  color:white; 
}
.mobile-app .gm-title {
  color:black;
}



`}

</style>

</MobileActiveContextProvider>
</DataContextProvider>


)


}

export default Mobile; 