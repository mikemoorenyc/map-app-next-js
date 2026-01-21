
import { AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import { memo,useCallback,useMemo ,useState,useEffect} from "react";
import { TLayer, TPin } from "@/projectTypes";
import useActiveStore from "@/app/contexts/useActiveStore";
import { useFindLayer } from "@/app/lib/useLayerData";
type Props ={
  pin:TPin,

  onClick: (pin:TPin,active:boolean)=>void


}

const AMMemo = memo(AdvancedMarker); 
const PinMemo = memo(Pin); 

export default  ({pin, onClick}:Props) => {
  const activePin = useActiveStore(s=>s.activePin);
  
  const active = activePin == pin.id; 
  const location = useMemo(()=>pin.location,[pin])

  const markerClick = useCallback(()=> {
    onClick(pin,active)
  },[onClick,pin,active])
  
  let zindex = pin.favorited ? 2 :1; 
  if(active) {
    zindex = 9999;
  }
  const layer = useFindLayer(pin.layerId);
  if(!layer) {
    throw new Error("no layer found");
  }



  
  console.log("pin rendered");

 

  
  return <AMMemo onClick={markerClick} position={location} zIndex={zindex}>
  <div>
      <PinMemo  onMap={true} interactable={true} size={14} layer={layer} pin={pin} highlighted={active} />
    </div>
    
  </AMMemo>
  
}
