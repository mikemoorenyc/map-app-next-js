import { useContext, useEffect, useMemo,useState } from "react";
import DataContext from "@/app/contexts/DataContext";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";

const Pins = () => {
  const map = useMap(); 
  const {disabledLayers, activePin} = useContext(MobileActiveContext).activeData 
  const {layerData} = useContext(DataContext);
  const [firstLoad,updateFirstLoad] = useState(false);
  const pinsFlat = useMemo(()=>layerData.map(l => l.pins).flat(),[layerData])
  useEffect(()=> {
    if(!map || !pinsFlat.length) return ;
    if(firstLoad) return ; 
    
    updateFirstLoad(true);
    var bounds = new google.maps.LatLngBounds();
    pinsFlat.forEach(p => {
       bounds.extend(p.location);
    })
    map.fitBounds(bounds, 1
    );

  
    


  },[map,pinsFlat])
  return <>
  {pinsFlat.filter(p => !disabledLayers.includes(p.layerId)).map((pin)=><Marker active={activePin == pin.id} pin={pin}  key={pin.id}/>)}


  </>
}

export default Pins