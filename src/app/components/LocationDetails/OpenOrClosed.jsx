import styles from "./styles.module.css"

import { useEffect,useState } from "react"
import { useMap } from "@vis.gl/react-google-maps";
import { RiTimeLine } from "@remixicon/react";

const confirmOpenTime = (openData,id) => {
  //Test if still open
  const rn = new Date(); 
  if(openData?.nextCloseTime) {
    if(rn > openData.nextCloseTime) return false; 
  }
  if(openData?.nextOpenTime) {
    if(rn > openData.nextOpenTime) return true; 
  }
  return false; 
}

function getRelativeOpeningTime(openingTime) {
  const now = new Date();
  const openingDate = new Date(openingTime);

  const diffMs = openingDate - now;

  if (diffMs <= 0) return "Already opened"; // or "Now open"

  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const date = `Opens ${openingDate.toLocaleString('en-us', {  weekday: 'short'})} at ${openingDate.toLocaleTimeString("en-US",{
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})}`


  if (diffMinutes < 60) {
    return {text:`Opens in ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`,alert:false};
  } else if (diffHours < 12) {
    return {text:date,alert:true};
  } else if (diffDays === 1) {
    return {text:date,alert:true};;
  } else {
    return {text:date,alert:true};;
  }
}

export default function({placeData,itemRow}) {
  const ItemRow = itemRow

  const [openingInfo,updateOpeningInfo] = useState(null);
  const map = useMap(); 


  const getData = async () => {

    

    updateOpeningInfo(null);
    if(placeData?.id && typeof placeData.id !== "string") return ; 
    const id = placeData?.id||placeData?.place_id
    
    const openingUrl =`https://places.googleapis.com/v1/places/${id}?fields=currentOpeningHours,utcOffsetMinutes&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`;

    const currentHours = await fetch(openingUrl);
    if(!currentHours.ok) {
      return ; 
    }
    
    const {currentOpeningHours,utcOffsetMinutes} = await currentHours.json(); 
    console.log(utcOffsetMinutes);
    if(!currentOpeningHours) return ; 
    sessionStorage.setItem("open_status_"+id,JSON.stringify({
        openNow: currentOpeningHours.openNow,
        nextCloseTime: currentOpeningHours?.nextCloseTime||null,
        nextOpenTime: currentOpeningHours?.nextOpenTime||null
      }))

    console.log(currentOpeningHours);
    if(currentOpeningHours.openNow) {
      
      updateOpeningInfo({text:"Open now",alert:false});
      return ; 
    } else {
      updateOpeningInfo(getRelativeOpeningTime(currentOpeningHours?.nextOpenTime))
    }
    

    /*

    const open =await place.isOpen();
    if(open) {
      updateOpeningInfo({text:"Open now",alert:false});
      return ; 
    }
    if(!open) {
      const nextOpening = await place.getNextOpeningTime();
      if(!nextOpening) return ;
      updateOpeningInfo(getRelativeOpeningTime(nextOpening))
    }

    */


  }

  useEffect(()=> {
    if(!map ) return ; 
    const id = placeData?.id||placeData?.place_id;



    if(!sessionStorage.getItem('open_status_'+id)) {
      getData(); 
    }
    const seshData = JSON.parse(sessionStorage.getItem("open_status_"+id))
    if(confirmOpenTime(seshData)) {
      updateOpeningInfo({text:"Open now",alert:false});
      return ; 
    } 
    if(seshData?.nextOpenTime) {
      updateOpeningInfo(getRelativeOpeningTime(seshData.nextOpenTime))
      return; 
    }
    
    updateOpeningInfo({text:"Closed",alert:true}); 
    
    
  },[map,placeData])


  if(!openingInfo) return ; 
  return <ItemRow className={openingInfo.alert ? styles.openOrNotClosed:""}>
    <RiTimeLine className={styles.svg}/>
    <span className={styles.openOrNot}>{openingInfo.text}</span>
  </ItemRow>
}