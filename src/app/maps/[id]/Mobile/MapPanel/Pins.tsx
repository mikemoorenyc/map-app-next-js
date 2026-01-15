import { useRef,useContext,memo,useCallback ,useMemo,useState, useEffect} from "react";
import MobileActiveContext from "@/_contexts/MobileActiveContext";
import { useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";
import mapCenterer from "../lib/mapCenterer";

import useLayerData from "@/_lib/useLayerData";
import { TLayer, TPin } from "@/projectTypes";
    type Props ={
      pinsFlat:TPin[],
      disabledLayers: number[],
      findLayer:(number:number)=>TLayer,
      markerClicked: (p:TPin,active:boolean)=>void,
      activePin: string|number|null, 
      map:google.maps.Map|null,

    }
  

const PinsWrapper = () => {
    const map = useMap(); 
    const {disabledLayers, activePin,backState} = useContext(MobileActiveContext).activeData 
    const {activeDispatch} = useContext(MobileActiveContext)
    let {pinsFlat,findLayer} = useLayerData(); 
    const [mapBounds,updateMapBounds] = useState<google.maps.LatLngBounds|null>(null)
  


  const markerClicked = useCallback((pin:TPin,active:boolean) => {
    if(active||!map) {
      
      return ; 
    }
    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type:"BACK_STATE",state:backState == "back_to_legend"? "back_to_legend":"back_to_base"})
    mapCenterer(map, pin.location);
  },[mapCenterer,map,activeDispatch]);







  const updater = useCallback(() => {
    if(!map) return ; 
    const bounds = map.getBounds()
    if(!bounds) return ;
    updateMapBounds(bounds);

  }, [map]);



useEffect(() => {
    if (!map) return;

    const listener = google.maps.event.addListener(map, "idle", updater);
    updater(); // initial run
    return () => listener.remove();
  }, [map, updater]);

  // Also update whenever pins change (async data)

  pinsFlat = useMemo(()=> {
    if(pinsFlat.length < 75) return pinsFlat;
    if(!mapBounds) return pinsFlat;

    return pinsFlat.filter(p => mapBounds.contains(p.location));

  },[pinsFlat,mapBounds])


  

  const p = {pinsFlat,findLayer,disabledLayers,markerClicked,activePin,map}
 
  return <PinsMemo {...p}  />

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

  {[...pinsFlat].reverse().filter(p => !disabledLayers.includes(p.layerId)).map((pin)=><TheMarker map={map} layer={layerMap[pin.id]} onClick={markerClicked} activePin={activePin} pin={pin}  key={pin.id}/>)}


  </>
}
const PinsMemo = memo(Pins)

const TheMarker = memo(Marker)



export default PinsWrapper