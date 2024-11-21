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
:root {
  --blue-accent : #75b0e8;  
  --screen-text: white;
  --screen-bg: black; 
}
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
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  50% {transform: rotate(0deg);}
  75% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(0deg);
  }
}


`}

</style>

</MobileActiveContextProvider>
</DataContextProvider>


)


}

export default Mobile; 