import { TPin } from "@/projectTypes";
import { useMap } from "@vis.gl/react-google-maps";
import { useCallback } from "react";
type Actions = "contain"|"move"|"centerMobile"
export default function useMapMover() {

  const map = useMap(); 
  return useCallback((action:Actions,pinsFlat?:TPin[],moveCoord?:[number,number],zoom?:number,uiPadding?:{x:number,y:number}) => {
    if(!map) return ; 
    if(action == "contain") {
      if(!pinsFlat) {
        throw new Error("you didn't send pins");
      }
      var bounds = new google.maps.LatLngBounds();
      pinsFlat.forEach(p => {
       bounds.extend(p.location);
      })
      map.fitBounds(bounds, 1);
      return ; 
    }
    if(action == "move") {
      if(!moveCoord){
        throw new Error ("no coordinates")
      }
      map.setCenter(new google.maps.LatLng(moveCoord[0],moveCoord[1]))
    }
    if(action == "centerMobile") {
      if(!uiPadding) {
        throw new Error("no uiPadding");
      }

    }

  },[map])
}