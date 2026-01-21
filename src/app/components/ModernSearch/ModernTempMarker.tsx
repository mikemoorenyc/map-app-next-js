import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import { useContext } from "react";

import { AdvancedMarker} from "@vis.gl/react-google-maps";

export default function ModernTempMarker() {
  const {infoWindowState} = useContext(InfoWindowContext)

  const position = infoWindowState.tempMarkerPosition


  return <>
  {position && <AdvancedMarker zIndex={999} position={position}/>}
  </>
}
