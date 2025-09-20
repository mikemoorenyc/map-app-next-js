
import { AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import { memo,useCallback,useMemo ,useState,useEffect} from "react";
import { TLayer, TPin } from "@/projectTypes";
type Props ={
  pin:TPin,
  activePin:string|number|null,
  onClick: (pin:TPin,active:boolean)=>void
  layer:TLayer,
  map:google.maps.Map|null
}

const AMMemo = memo(AdvancedMarker); 
const PinMemo = memo(Pin); 

export default  ({pin, activePin,onClick,layer,map}:Props) => {

  
  const active = activePin == pin.id; 
  const location = useMemo(()=>pin.location,[pin])

  const markerClick = useCallback(()=> {
    onClick(pin,active)
  },[onClick,pin,active])
  
  let zindex = pin.favorited ? 2 :1; 
  if(active) {
    zindex = 9999;
  }
  const [showing,updateShowing] = useState(true)


  
  
  useEffect(()=>{
    if(!map) return ; 

    const boundsCheck = () => {
      updateShowing(map.getBounds()?.contains(pin.location)||false)
    }
   
   const boundsListener = map.addListener("bounds_changed",boundsCheck);
   return () => {
    boundsListener.remove(); 
   }

  },[map])
 
 

  if(!showing) return ; 

  
  return <AMMemo onClick={markerClick} position={location} zIndex={zindex}>
  <div>
      <PinMemo  onMap={true} interactable={true} size={14} layer={layer} pin={pin} highlighted={active} />
    </div>
    
  </AMMemo>
  
}
