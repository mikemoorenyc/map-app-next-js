
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import { memo,useCallback,useMemo ,useState,useEffect} from "react";


const AMMemo = memo(AdvancedMarker); 
const PinMemo = memo(Pin); 

export default  ({pin, activePin,onClick,layer,map}) => {
  const [showing,updateShowing] = useState(true);
  
  const active = activePin == pin.id; 
  const location = useMemo(()=>pin.location,[pin])

  const markerClick = useCallback(()=> {
    onClick(pin,active)
  },[onClick,pin,active])
  
  let zindex = pin.favorited ? 2 :1; 
  if(active) {
    zindex = 9999;
  }

  useEffect(()=> {
    if(!map|| google.maps) return ;
  
    let eventCheck ; 
   
    const check = () => {

      updateShowing(map.getBounds().contains(pin.location))
    }
    eventCheck = map.addListener("bounds_changed", check)
    return () => {
      map.removeListener(eventCheck);
    }
  },[map])
  
  /*
  useEffect(()=>{
    if(!map) return ; 
   
   let zooming = false; 
   let intTest ; 
    const setZoom = () => {
    
      if(zooming) return ; 
      intTest = setInterval(()=> {
        updateShowing(prev => {
          return !prev
        })
      },50)
      zooming = true; 
      console.log("zoom");
    }
  
    map.addListener("zoom_changed",setZoom);
    map.addListener("idle",()=> {
      clearInterval(intTest)
      zooming = false; 
      console.log("idle");
      updateShowing(true);

    })

  },[map])
 */
 

  

  
  return <AMMemo onClick={markerClick} position={location} zIndex={zindex}>
  <div style={{contentVisibility:showing?"visible":"hidden"}}>
      <PinMemo saveGlyph={"mobile"} windowOpen={false} onMap={true} interactable={true} imgSize={26} size={14} layer={layer} pin={pin} highlighted={active} mobile={true}/>
    </div>
    
  </AMMemo>
  
}
