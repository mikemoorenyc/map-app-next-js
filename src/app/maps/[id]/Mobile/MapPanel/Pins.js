import { useContext, useEffect } from "react";
import DataContext from "@/app/contexts/DataContext";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";

const Pins = () => {
  const map = useMap(); 
  const {disabledLayers, activePin} = useContext(MobileActiveContext).activeData 
  const {layerData} = useContext(DataContext);
  const pinsFlat = layerData.map(l => l.pins).flat();
  useEffect(()=> {
    if(!map) return ;
    var bounds = new google.maps.LatLngBounds();
    pinsFlat.forEach(p => {
       bounds.extend(p.location);
    })
    map.fitBounds(bounds);


  },[map])
  return <>
  {pinsFlat.filter(p => !disabledLayers.includes(p.layerId)).map((pin)=><Marker active={activePin == pin.id} pin={pin}  key={pin.id}/>)}


  </>
}

export default Pins