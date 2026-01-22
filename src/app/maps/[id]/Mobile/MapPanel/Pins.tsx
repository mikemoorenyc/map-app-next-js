import { useRef,useContext,memo,useCallback ,useMemo,useState, useEffect} from "react";
//import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";
import mapCenterer from "../lib/mapCenterer";


import { TLayer, TPin } from "@/projectTypes";
import { usePinsFlat ,useFindLayer} from "@/app/lib/useLayerData";
import useActiveStore from "@/app/contexts/useActiveStore";
    type Props ={
      pinsFlat:TPin[],
      disabledLayers: number[],

      markerClicked: (p:TPin,active:boolean)=>void,
      activePin: string|number|null, 
      map:google.maps.Map|null,

    }
  
const Pins = () => {
  const map = useMap(); 
  const pinsFlat = usePinsFlat(); 

  const disabledLayers = useActiveStore(s=>s.disabledLayers);
  const backState = useActiveStore(s=>s.backState);
  const activePin = useActiveStore(s=>s.activePin);
  const updateActivePin=useActiveStore(s=>s.updateActivePin);
  const updateDrawerState=useActiveStore(s=>s.updateDrawerState);
  const updateBackState=useActiveStore(s=>s.updateBackState);
  
  const [mapBounds,updateMapBounds] = useState<google.maps.LatLngBounds|null>(null);

  const markerClicked = useCallback((pin:TPin,active:boolean)=> {
    if(active||!map) return ; 
    updateActivePin(pin.id);
    updateDrawerState("open")
    updateBackState(backState == "back_to_legend"? "back_to_legend":"back_to_base");
    mapCenterer(map, pin.location);
  },[map,backState])

  const updater = useCallback(()=> {
    if(!map) return false; 
    const bounds = map.getBounds()
    if(!bounds) return ;
    updateMapBounds(bounds);
  },[map]);

  useEffect(()=> {
    if(!map) return; 
    const listener = google.maps.event.addListener(map, "idle", updater);
    updater(); // initial run
    return () => listener.remove();
  },[map,updater]);

  const pinsInView = useMemo(()=> {
    if(pinsFlat.length < 75) return pinsFlat;
    if(!mapBounds) return pinsFlat;
    return pinsFlat.filter(p => mapBounds.contains(p.location));
  },[pinsFlat,mapBounds])

  

  return <>

  {pinsInView.reverse().filter(p=>!disabledLayers.includes(p.layerId)).map(p=><Marker key={p.id} onClick={markerClicked} pin={p} />)}
  
  </>
}

export default Pins;
    /*





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


  

  const p = {pinsFlat,disabledLayers,markerClicked,activePin,map}
 
  return <PinsMemo {...p}  />

}

const Pins = ({pinsFlat,disabledLayers,markerClicked,activePin,map}:Props) => {
  const layerMap= useMemo(()=> {
    const layerMap : {
      [key:string|number]:TLayer
    } = {}
    pinsFlat.forEach(p => {
      console.log(p);
      const layer = useFindLayer(p.layerId)
      if(!layer) return ; 
      layerMap[p.id] = layer;
    });
    return layerMap

  },[pinsFlat])
  
 



  return <>

  {[...pinsFlat].reverse().filter(p => !disabledLayers.includes(p.layerId)).map((pin)=><TheMarker map={map} layer={layerMap[pin.id]} onClick={markerClicked} activePin={activePin} pin={pin}  key={pin.id}/>)}


  </>
}
const PinsMemo = memo(Pins)

const TheMarker = memo(Marker)



export default PinsWrapper
*/