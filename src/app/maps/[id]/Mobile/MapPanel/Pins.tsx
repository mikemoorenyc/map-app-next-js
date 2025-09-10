import { useContext,memo,useCallback ,useMemo} from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";
import mapCenterer from "../lib/mapCenterer";

import useLayerData from "@/app/lib/useLayerData";
import { TLayer, TPin } from "@/projectTypes";
    type Props ={
      pinsFlat:TPin[],
      disabledLayers: number[],
      findLayer:(number:number)=>TLayer,
      markerClicked: (p:TPin,active:boolean)=>void,
      activePin: string|number|null, 
      map:google.maps.Map|null
    }
  

const PinsWrapper = () => {
    const map = useMap(); 
    const {disabledLayers, activePin,backState} = useContext(MobileActiveContext).activeData 
    const {activeDispatch} = useContext(MobileActiveContext)
    const {pinsFlat,findLayer} = useLayerData(); 


  const markerClicked = useCallback((pin:TPin,active:boolean) => {
    if(active||!map) {
      
      return ; 
    }
    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type:"BACK_STATE",state:backState == "back_to_legend"? "back_to_legend":"back_to_base"})
    mapCenterer(map, pin.location);
  },[mapCenterer,map,activeDispatch])
  

  

  const p = {pinsFlat,findLayer,disabledLayers,markerClicked,activePin,map}
  return <PinsMemo {...p} />

}

const Pins = ({pinsFlat,disabledLayers,findLayer,markerClicked,activePin,map}:Props) => {
  const layerMap= useMemo(()=> {
    const layerMap : {
      [key:string|number]:TLayer
    } = {}
    pinsFlat.forEach(p => {
      layerMap[p.id] = findLayer(p.layerId);
    });
    return layerMap

  },[pinsFlat,findLayer])
  
 



  return <>

  {pinsFlat.reverse().filter(p => !disabledLayers.includes(p.layerId)).map((pin)=><TheMarker map={map} layer={layerMap[pin.id]} onClick={markerClicked} activePin={activePin} pin={pin}  key={pin.id}/>)}


  </>
}
const PinsMemo = memo(Pins)

const TheMarker = memo(Marker)



export default PinsWrapper
