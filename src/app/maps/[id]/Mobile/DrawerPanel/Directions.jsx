'use client'
import { RiCarLine, RiRidingLine, RiTrainLine, RiWalkLine } from "@remixicon/react"
import styles from "./styles.module.css"
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useContext } from "react";
import makeNativeLink from "../lib/makeNativeLink";


export default function ({pin}) {
  const {routes,geolocation} = useContext(MobileActiveContext).activeData;
  if(!routes) return ; 
  const methods = ["TRANSIT","WALKING","DRIVING","BICYCLING"];
  const icons = [<RiTrainLine />,<RiWalkLine />,<RiCarLine />,<RiRidingLine />]

  const pinId = pin?.id || pin.place_id; 
  return <div className={styles.dirButtons}>

    {methods.map((m,i)=> {
      const r = routes[m];
      if(!r) return false; 
      return <a key={m} className={styles.dirButton} target="_blank" href={`comgooglemaps://?daddr=${pin.location.lat},${pin.location.lng}&directionsmode=${m.toLowerCase()}`}> 
       
        <span className={`${styles.destinationIcon} flex-center-center`}>{icons[i]}</span>

        
        <span className={styles.destinationTime} >{r.value <= 3600 ? r.text: Math.floor(r.value/3600) + " hrs"}</span>

      </a>
    })}
  
  </div>  
  
}

