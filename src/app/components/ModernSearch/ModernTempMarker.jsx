import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import { useContext } from "react";
import ActiveContext from "@/app/contexts/ActiveContext";
import DataContext from "@/app/contexts/DataContext";

import { AdvancedMarker} from "@vis.gl/react-google-maps";

export default function ModernTempMarker() {
  const {infoWindowState} = useContext(InfoWindowContext)
  const {activeData} = useContext(ActiveContext); 
  const {layerData} = useContext(DataContext); 
  const position = infoWindowState.tempMarkerPosition
  const currentLayer = layerData.find(l => l.id == activeData.activeLayer)
    let activeColor  = "#ffffff"
    if(activeData?.activeLayer) {
        activeColor = currentLayer?.color
    }

    let foregroundColor = "#ffffff";
  
    if(currentLayer?.lightOrDark == "light") {
        foregroundColor = "#000000";
    }

  return <>
  {position && <AdvancedMarker position={position}/>}
  </>
}
