import { RiFocus3Line } from "@remixicon/react";
import styles from "./styles.module.css";
import Button from "@/_components/Button";
import MobileActiveContext from "@/_contexts/MobileActiveContext";
import { SyntheticEvent, useCallback, useContext } from "react";
import useMapMover from "@/_lib/useMapMover";
import useLayerData from "@/_lib/useLayerData";
import { useMap } from "@vis.gl/react-google-maps";

export default function ()  {
  const {activeData,activeDispatch} = useContext(MobileActiveContext)
  const {geolocation,inBounds,activePin,tempData} = activeData;
  const mapMover = useMapMover(); 
  const map = useMap(); 
  const {findPin} = useLayerData(); 
  if(!geolocation) return ;
  
  const reCenter = useCallback((e:SyntheticEvent) => {
    e.preventDefault();
    if(!map) return ; 
    if(!activePin) {
      mapMover("move",undefined,[geolocation.lat,geolocation.lng]);
      return ; 
    }
    const pin = activePin == "temp" ? tempData : findPin(activePin);
    if(!pin) return ; 
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(geolocation);
    bounds.extend(pin.location);
    activeDispatch({
      type:"DRAWER_STATE",
      state: "minimized"
    })
    map.fitBounds(bounds,{
      top:60,
      right: 10,
      bottom: 40,
      left:10
    });

  },[map,geolocation,activePin,tempData]);

  if(!geolocation || !inBounds) return ; 

  return( 
    <Button onClick={reCenter} className={styles.centerButton} modifiers={["sm","icon","secondary","round"]} style={{position:"absolute"}}>
    <RiFocus3Line size={16} />
    </Button>
  
  )

}