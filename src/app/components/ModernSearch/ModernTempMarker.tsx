import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import { useContext } from "react";
import ActiveContext from "@/app/contexts/ActiveContext";
import DataContext from "@/app/contexts/DataContext";

import { AdvancedMarker} from "@vis.gl/react-google-maps";
import useLayerData from "@/app/lib/useLayerData";

export default function ModernTempMarker() {
  const {infoWindowState} = useContext(InfoWindowContext)
  const {activeData} = useContext(ActiveContext); 
  const layerData = useLayerData().layers
  const position = infoWindowState.tempMarkerPosition
  const currentLayer = layerData.find(l => l.id == activeData.activeLayer)
    let activeColor  = "#ffffff"
    if(currentLayer) {
        activeColor = currentLayer?.color
    }

    let foregroundColor = "#ffffff";
  
    if(currentLayer?.lightOrDark == "light") {
        foregroundColor = "#000000";
    }

  return <>
  {position && <AdvancedMarker zIndex={999} position={position}/>}
  </>
}
