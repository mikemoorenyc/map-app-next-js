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


`}

</style>

</MobileActiveContextProvider>
</DataContextProvider>


)


}

export default Mobile; 