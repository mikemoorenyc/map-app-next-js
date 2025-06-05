
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import { memo } from "react";


export default  ({pin, active,onClick,layer}) => {

 

  
  /*
  if(!pin.favorited && !pin.highlighted && !active) {
    const icon = pin?.icon || pin.title.charAt(0);
    const hasIcon = pin?.icon ? true : false 
    const color = layer?.color || "#ffffff";
    const lightOrDark = layer?.lightOrDark;
    return <Marker onClick={markerClicked} position={pin.location} icon={`/api/glyph?visited=${(pin.visited||false).toString()}&favorited=${(pin.favorited|| false).toString()}&icon=${icon}&size=${13}&w=${24}&color=${encodeURIComponent(color)}&ld=${lightOrDark}&hasIcon=${(hasIcon||false).toString()}`}/>
  }*/
  const PinMemo = memo(Pin); 
  return <AdvancedMarker onClick={()=>{onClick(pin,active)}} position={pin.location} zIndex={active || pin.favorited ? 999999 : null}>
    <PinMemo windowOpen={false} onMap={true} interactable={true} imgSize={26} size={13} layer={layer} pin={pin} highlighted={active} mobile={true}/>
  </AdvancedMarker>
  
}