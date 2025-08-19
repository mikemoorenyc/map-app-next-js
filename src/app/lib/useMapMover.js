import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";

export default function MapMover() {

  const map = useMap(); 
  return useCallback((action,pinsFlat) => {
    if(!map) return ; 
    if(action == "contain") {
      var bounds = new google.maps.LatLngBounds();
      pinsFlat.forEach(p => {
       bounds.extend(p.location);
      })
      map.fitBounds(bounds, 1);
      return ; 
    }

  },[map])
}