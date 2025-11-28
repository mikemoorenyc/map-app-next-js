import styles from "./styles.module.css"
import ItemRow from "./ItemRow";
import { useContext, useEffect,useState } from "react"
import { useMap } from "@vis.gl/react-google-maps";
import { RiTimeLine } from "@remixicon/react";
import { TPin, TPinTemp, TPlaceDetails } from "@/projectTypes";
import { TempData } from "@/app/contexts/MobileActiveContext";
import testData from "./testData";







export default function({placeData}:{placeData:TPin|TempData}) {

  
  let id;
  if(placeData?.id) {

  }

  const [openingInfo,updateOpeningInfo] = useState<{
    text:string,
    alert?: boolean
  }|null>(null);
  const map = useMap(); 


  const getData = async () => {

    

    updateOpeningInfo(null);
    if(placeData?.id && typeof placeData.id !== "string") return ; 
    const id = placeData?.id
    
    const openingUrl =`https://places.googleapis.com/v1/places/${id}?fields=currentOpeningHours&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`;

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
  const getHoursData = async (pin:TPin|TempData) => {
    console.log("data");
    const hoursCheck = await fetch(`/api/tripadvisor?type=hours&title=${pin.title}&coords=${pin.location.lat},${pin.location.lng}&addr=${pin.formatted_address}`);
    if(!hoursCheck.ok) {
      console.log( hoursCheck.status);
      return false; 
    }
    console.log(await hoursCheck.json());


  }
  const checker = () => {
    const {timezone,periods,holidays} = testData.hours;
    const today = new Date(); 
    const todayHours = ""; 
    let weekday = today.getDay();
    if(weekday === 0) {
      weekday = 7; 
    }
    periods.forEach(p => {
      if(p.open.day !== weekday) {
        return ; 
      }
      const todayHours = today.getHours() * 100  + today.getMinutes();
      if(todayHours >= parseInt(p.open.time) && todayHours <= parseInt(p.close.time)) {
        console.log("open");
        return false; 
      } else {
        
      }
   
    })
    //CheckHoliday
    holidays.forEach(h => {
      const date = new Date(h.date+"T08:00:00");
      console.log(date.getFullYear(),date.getDate(),date.getMonth()+1,h.name);
      console.log(today.getFullYear(),today.getDate(),today.getMonth()+1);
      if(date.getFullYear() ===today.getFullYear() && date.getDate() === today.getDate() && date.getMonth() === today.getMonth() ) {
        console.log("no work today");
        return false; 
      }
    })

  }
  useEffect(()=> {
    if(!map ) return ; 
    console.log(placeData);
    //getHoursData(placeData);
    checker(); 
    
  
    
  },[map,placeData])


  if(!openingInfo) return ; 
  return <ItemRow className={openingInfo.alert ? styles.openOrNotClosed:""}>
    <RiTimeLine className={styles.svg}/>
    <span className={styles.openOrNot}>{openingInfo.text}</span>
  </ItemRow>
}