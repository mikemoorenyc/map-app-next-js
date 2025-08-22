'use client'
import { RiCarLine, RiRidingLine, RiTrainLine, RiWalkLine } from "@remixicon/react"
import styles from "./styles.module.css"
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { useContext ,useEffect,useState} from "react";


export default function ({pin}) {
  const {routes,geolocation} = useContext(MobileActiveContext).activeData;
  const [routeData,updateRouteData] = useState(null);
  
  const methods = ["walking","driving","cycling"];
  const icons = [<RiTrainLine />,<RiWalkLine />,<RiCarLine />,<RiRidingLine />]

  const pinId = pin?.id || pin.place_id;
  const setTimes = async () => {
    updateRouteData(null);
    const array = {};
    for(const method of methods) {
      const time = await fetch(`https://api.mapbox.com/directions/v5/mapbox/${method}/${geolocation.lng},${geolocation.lat};${pin.location.lng},${pin.location.lat}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}${method=="walking"?`&walking_speed=${encodeURIComponent(`1.3`)}`:""}`);
      if(!time.ok) {continue;}
      const data = await time.json();
      if(data.code != "Ok") {
        continue; 
      }
      const duration = data.routes[0].duration; 
      let text = "";
      if(duration<=3600) {
        text = Math.floor(duration/60) + " min";
      }
      array[method] = {
        text: text,
        value: duration
      }
    }
    updateRouteData(array);
   
    
  } 
  useEffect(()=> {
    if(!pin || !geolocation) return ;
      
    setTimes(); 
  },[pin]);
  if(!routes && !routeData) return ; 
  const rMerged = {...routes,...routeData};
  return <div className={styles.dirButtons}>

    {[...["TRANSIT"],...methods].map((m,i)=> {
      const r = rMerged[m];
      const mode = m == "cycling"?"bicycling":m.toLowerCase(); 
      if(!r) return false; 
      return <a key={m} className={styles.dirButton} target="_blank" href={`comgooglemaps://?daddr=${encodeURIComponent(pin.formatted_address)}&directionsmode=${mode}`}> 
       
        <span className={`${styles.destinationIcon} flex-center-center`}>{icons[i]}</span>

        
        <span className={styles.destinationTime} >{r.value <= 3600 ? r.text: Math.floor(r.value/3600) + " hr"+(Math.floor(r.value/3600)>1?"s":"")}</span>

      </a>
    })}
  
  </div>  
  
}

