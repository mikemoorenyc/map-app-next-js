'use client'
import { RiCarLine, RiRidingLine, RiTrainLine, RiWalkLine } from "@remixicon/react"
import styles from "./styles.module.css"
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useContext } from "react";


export default function ({pin}) {
  const {routes} = useContext(MobileActiveContext).activeData;
  if(!routes) return ; 
  const methods = ["TRANSIT","WALKING","DRIVING","BICYCLING"];
  const icons = [<RiTrainLine />,<RiWalkLine />,<RiCarLine />,<RiRidingLine />]
console.log(routes["DRIVING"]);

  return <div className={styles.dirButtons}>

    {methods.map((m,i)=> {
      const r = routes[m];
      if(!r) return false; 
      return <div key={m} className={styles.dirButton}> 
        <span>{icons[i]}</span>
        <span>{r.value <= 3600 ? r.text: Math.floor(r.value/3600) + " hrs"}</span>

      </div>
    })}
  
  </div>
  
}

