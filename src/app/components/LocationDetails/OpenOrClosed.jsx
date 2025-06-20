import styles from "./styles.module.css"

import { useEffect,useState } from "react"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { RiTimeLine } from "@remixicon/react";

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
  const placesLib = useMapsLibrary('places');

  const getData = async () => {
    updateOpeningInfo(null);
    if(placeData?.id && typeof placeData.id !== "string") return ; 
    const place = new placesLib.Place({
        id: placeData?.id || placeData?.place_id,
        requestedLanguage: 'en', // optional
    });
    await place.fetchFields({ fields: ['regularOpeningHours'] });
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


  }

  useEffect(()=> {
    if(!placesLib || !map ) return ; 
    
    
    
    getData(); 
  },[placesLib,map,placeData])


  if(!openingInfo) return ; 
  return <ItemRow className={openingInfo.alert ? styles.openOrNotClosed:""}>
    <RiTimeLine className={styles.svg}/>
    <span className={styles.openOrNot}>{openingInfo.text}</span>
  </ItemRow>
}