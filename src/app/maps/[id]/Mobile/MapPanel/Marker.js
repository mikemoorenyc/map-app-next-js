import { useContext,useMemo } from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { AdvancedMarker, Marker } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import mapCenterer from "../lib/mapCenterer";
import { useMap } from "@vis.gl/react-google-maps";
import { findLayer } from "../../desktop/MapPanel/lib/finders";
import DataContext from "@/app/contexts/DataContext";


export default  ({pin, active}) => {
  const {layerData} = useContext(DataContext)
  const {activeDispatch,activeData} = useContext(MobileActiveContext);
  const {activePin,backState} = activeData
  const map = useMap(); 
  const layer = useMemo(()=>findLayer(layerData,pin.layerId),[layerData]);
  const markerClicked = () => {
    if(activePin == pin.id) {
      
      return ; 
    }
    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type:"BACK_STATE",state:backState == "back_to_legend"? "back_to_legend":"back_to_base"})
    mapCenterer(map, pin.location);
  }
  /*
  if(!pin.favorited && !pin.highlighted && !active) {
    const icon = pin?.icon || pin.title.charAt(0);
    const hasIcon = pin?.icon ? true : false 
    const color = layer?.color || "#ffffff";
    const lightOrDark = layer?.lightOrDark;
    return <Marker onClick={markerClicked} position={pin.location} icon={`/api/glyph?visited=${(pin.visited||false).toString()}&favorited=${(pin.favorited|| false).toString()}&icon=${icon}&size=${13}&w=${24}&color=${encodeURIComponent(color)}&ld=${lightOrDark}&hasIcon=${(hasIcon||false).toString()}`}/>
  }*/
  return <AdvancedMarker onClick={markerClicked} position={pin.location} zIndex={active || pin.favorited ? 999999 : null}>
    <Pin windowOpen={false} onMap={true} interactable={true} imgSize={26} size={13} layer={layer} pin={pin} highlighted={active} mobile={true}/>
  </AdvancedMarker>
  
}
