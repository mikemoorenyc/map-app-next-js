'use client'
import { RiCarLine, RiRidingLine, RiTrainLine, RiWalkLine } from "@remixicon/react"
import styles from "./styles.module.css"
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { createElement, useContext ,useEffect,useState} from "react";
import { TGeolocation } from "@/projectTypes";
import { TRoute } from "@/app/contexts/MobileActiveContext";

type DirectionNeeds = {
  location:TGeolocation,
  formatted_address?:string
}
type DirectionOptions = {
    walking:TRoute|null,
    driving:TRoute|null,
    cycling:TRoute|null,
    TRANSIT:TRoute|null
  }


export default function ({pin,geolocation}:{pin:DirectionNeeds,geolocation:TGeolocation}) {
  const {routes} = useContext(MobileActiveContext).activeData;
  const initState = {  walking:null,driving:null,cycling:null,TRANSIT:null}
  const [routeData,updateRouteData] = useState<DirectionOptions>(initState);
  
  const methods = ["walking","driving","cycling"];
  const icons = [<RiTrainLine />,<RiWalkLine />,<RiCarLine />,<RiRidingLine />]
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
  
  const setTimes = async () => {
    updateRouteData(initState);
    const array :Partial<DirectionOptions>= {};
    for(const method of methods) {
      const time = await fetch(`https://api.mapbox.com/directions/v5/mapbox/${method}/${geolocation.lng},${geolocation.lat};${pin.location.lng},${pin.location.lat}?access_token=${token}${method=="walking"?`&walking_speed=${encodeURIComponent(`1.3`)}`:""}`);
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
      array[method as keyof DirectionOptions] = {
        text: text,
        value: duration
      }
    }
    updateRouteData(array as DirectionOptions);
   
    
  } 
  useEffect(()=> {
    if(!pin || !geolocation) return ;
      
    setTimes(); 
  },[pin]);
  if(!routes && !routeData) return ; 
 
  const rMerged = {...routes,...routeData};

  return <div className={styles.dirButtons}>

    {[...["TRANSIT"],...methods].map((m,i)=> {
      const r = rMerged[m as keyof DirectionOptions];
  
      const mode = m == "cycling"?"bicycling":m.toLowerCase(); 
      if(!r?.value||!r?.text) return ; 
      const time = r ? (r.value <= 3600 ? r.text: Math.floor(r.value/3600) + " hr"+(Math.floor(r.value/3600)>1?"s":"")): "Una"

      const inside = <> <span className={`${styles.destinationIcon} flex-center-center`}>{icons[i]}</span>

        
        <span className={styles.destinationTime} style={{visibility:!r?"hidden":undefined}}>{time}</span>
      </>
      const containsLink = pin?.formatted_address; 

     

      const props = {
        className: styles.dirButton, 
        key: m,
        target:containsLink?"_blank":undefined,
        href:containsLink?`comgooglemaps://?daddr=${encodeURIComponent(containsLink)}&directionsmode=${mode}`:undefined
      }
      return createElement(containsLink?"a":"div",props,inside);

    })}
  
  </div>  
  
}

