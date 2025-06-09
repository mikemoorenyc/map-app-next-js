
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import { memo,useCallback,useMemo } from "react";


const AMMemo = memo(AdvancedMarker); 
const PinMemo = memo(Pin); 

export default  ({pin, active,onClick,layer}) => {


  const markerClick = useCallback(()=> {
    onClick(pin,active)
  },[onClick,pin,active])
  
  const zindex = useMemo(()=>{active || pin.favorited ? 999999 : null},[active,pin]);
  
  const location = useMemo(()=>pin.location,[pin])

  
  return <AMMemo onClick={markerClick} position={location} zIndex={zindex}>
    <PinMemo windowOpen={false} onMap={true} interactable={true} imgSize={26} size={13} layer={layer} pin={pin} highlighted={active} mobile={true}/>
  </AMMemo>
  
}
