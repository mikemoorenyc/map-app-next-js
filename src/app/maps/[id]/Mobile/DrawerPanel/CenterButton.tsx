import { RiFocus3Line } from "@remixicon/react";
import styles from "./styles.module.css";
import Button from "@/app/components/Button";

import { SyntheticEvent, useCallback, useContext } from "react";
import useMapMover from "@/app/lib/useMapMover";

import { useMap } from "@vis.gl/react-google-maps";
import useActiveStore from "@/app/contexts/useActiveStore";
import { useFindPin } from "@/app/lib/useLayerData";

export default function ()  {

  const geolocation = useActiveStore(s=>s.geolocation);
  const activePin = useActiveStore(s=>s.activePin);
  const tempData = useActiveStore(s=>s.tempData);
  const inBounds = useActiveStore(s=>s.inBounds);
  const updateDrawerState = useActiveStore(s=>s.updateDrawerState)


  const mapMover = useMapMover(); 
  const map = useMap(); 
  const pin = useFindPin(activePin||-1) || tempData;
  if(!geolocation) return ;
  
  const reCenter = useCallback((e:SyntheticEvent) => {
    e.preventDefault();
    if(!map) return ; 
    if(!activePin) {
      mapMover("move",undefined,[geolocation.lat,geolocation.lng]);
      return ; 
    }

    if(!pin) return ; 
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(geolocation);
    bounds.extend(pin.location);
    updateDrawerState("minimized");
    map.fitBounds(bounds,{
      top:60,
      right: 10,
      bottom: 40,
      left:10
    });

  },[map,geolocation,pin,activePin]);

  if(!geolocation || !inBounds) return ; 

  return( 
    <Button onClick={reCenter} className={styles.centerButton} modifiers={["sm","icon","secondary","round"]} style={{position:"absolute"}}>
    <RiFocus3Line size={16} />
    </Button>
  
  )

}