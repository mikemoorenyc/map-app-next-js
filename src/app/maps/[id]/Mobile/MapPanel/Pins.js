import { useContext,  useMemo,memo,useCallback } from "react";
import DataContext from "@/app/contexts/DataContext";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";
import mapCenterer from "../lib/mapCenterer";
import { findLayer } from "../../desktop/MapPanel/lib/finders";


const PinsWrapper = () => {
    const map = useMap(); 
    const {disabledLayers, activePin,backState} = useContext(MobileActiveContext).activeData 
    const {activeDispatch} = useContext(MobileActiveContext)
    const {layerData} = useContext(DataContext);

    const pinsFlat = useMemo(()=>layerData.map(l => l.pins).flat(),[layerData])
      const markerClicked = useCallback((pin,active) => {
    if(active) {
      
      return ; 
    }
    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type:"BACK_STATE",state:backState == "back_to_legend"? "back_to_legend":"back_to_base"})
    mapCenterer(map, pin.location);
  },[mapCenterer,map,activeDispatch])
  


  const getLayer = useCallback((pin)=> {
    return findLayer(layerData,pin.layerId)
  },[layerData])
  const p = {pinsFlat,getLayer,disabledLayers,markerClicked,activePin,map}
  return <PinsMemo {...p} />

}

const Pins = ({pinsFlat,disabledLayers,getLayer,markerClicked,activePin,map}) => {


  return <>

  {pinsFlat.reverse().filter(p => !disabledLayers.includes(p.layerId)).map((pin)=><TheMarker map={map} layer={getLayer(pin)} onClick={markerClicked} activePin={activePin} pin={pin}  key={pin.id}/>)}


  </>
}
const PinsMemo = memo(Pins)

const TheMarker = memo(Marker)



export default PinsWrapper
