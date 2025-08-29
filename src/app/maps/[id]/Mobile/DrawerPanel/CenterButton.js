import { RiFocus3Line } from "@remixicon/react";
import styles from "./styles.module.css";
import Button from "@/app/components/Button";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useCallback, useContext } from "react";
import useMapMover from "@/app/lib/useMapMover";

export default function ()  {
  const {geolocation,inBounds} = useContext(MobileActiveContext).activeData;
  const mapMover = useMapMover(); 

  const reCenter = useCallback((e) => {
    e.preventDefault();
    mapMover("move",null,[geolocation.lat,geolocation.lng])
  },[geolocation]);

  if(!geolocation || !inBounds) return ; 

  return( 
    <Button onClick={reCenter} className={styles.centerButton} modifiers={["sm","icon","secondary","round"]}>
    <RiFocus3Line width={16} height={16} />
    </Button>
  
  )

}