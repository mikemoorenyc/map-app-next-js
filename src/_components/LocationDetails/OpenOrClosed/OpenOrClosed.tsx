import { TempData } from "@/_contexts/MobileActiveContext";
import { TPin ,THour} from "@/projectTypes";
import styles from "../styles.module.css"
import ItemRow from "../ItemRow";
import { RiTimeLine } from "@remixicon/react";
import { useContext, useEffect, useState } from "react";
import MobileActiveContext from "@/_contexts/MobileActiveContext";
import useLiveEditing from "@/_lib/useLiveEditing";

  const tooOldCheck =(hours:THour[]) => {
    console.log(hours);
    const today = new Date(); 
    let latestDay = today;
    let tooOld = true;
    hours.forEach(h => {
      const day = new Date(`${h.open.date.year}-${h.open.date.month}-${h.open.date.day}`)

      if(day>latestDay) {
        latestDay = day;
        tooOld = false; 
      }
    });
    return tooOld;
  }
  const convertTime = (time:{hour:number,minute:number}) => {
    const {hour,minute} = time; 
    let hString,mString; 
    let ampm = hour > 11 ? "pm":"am";
    if(hour === 0) {
      hString = 12;
    } else {
      hString = hour < 10 ? "0"+hour :hour; 
    }
    if(hour > 12) {
      if(hour - 12 < 10) {
        hString = "0"+(hour-12);
      } else {
        hString=hour-12;
      }
      
    }
    mString = minute < 10 ? "0"+minute : minute;
    return `${hString}:${mString}${ampm}`
  }
  const getCountryCode = (addressComponents: {
    types:string[],
    shortText:string
  }[]) => {
    const countryData = addressComponents.find(a => a.types.includes("political") && a.types.includes("country"));
    if(!countryData) return false; 
    return countryData.shortText; 
  }
 
export default function OpenOrClosed({pin}:{pin:TPin|TempData}) {

  const [isOpen,updateIsOpen] = useState<null|boolean>(null);
  const [hoursToday,updateHoursToday] = useState("");
  const [holiday,updateHoliday] = useState("");
  const {activePin,canEdit} = useContext(MobileActiveContext).activeData;
  const updatePin = useLiveEditing(); 
 

  const getHolidays = async (code:string) => {
    const today = new Date(); 
    const holidayLocal = localStorage.getItem("holiday-"+code);
    let holidays : {
      date:string,
      localName?:string,
      name?:string
    }[] = [];
    if(holidayLocal && JSON.parse(holidayLocal).year == today.getFullYear()) {
      console.log("pulled local");
      holidays = JSON.parse(holidayLocal).holidays
    } else {
      let url;
      if(process.env.NODE_ENV == "development") {
        url = "/api/dummyData?type=holidays"
      } else {
        url = `https://date.nager.at/api/v3/PublicHolidays/${today.getFullYear()}/${code}`
      }
      const data = await fetch(url);
      if(!data.ok) return ; 
      holidays = await data.json(); 
      localStorage.setItem(`holiday-${code}`,JSON.stringify({
        year: today.getFullYear(),
        holidays
      }))
    }
    const holidayToday = holidays.find(h => {
      const hDate = new Date(h.date+"T00:00:00");
      return hDate.getFullYear() === today.getFullYear() && hDate.getMonth() === today.getMonth() && hDate.getDate() === today.getDate(); 
    })
    if(holidayToday) {
      updateHoliday(holidayToday.name||holidayToday.localName||"");
    }
  }
  
  
  const pinGet = async () => {
  
    let url
    if(process.env.NODE_ENV == "development") {
       url = "/api/dummyData?type=place"
    } else {
       url = `https://places.googleapis.com/v1/places/${pin.id}?fields=currentOpeningHours,addressComponents&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`
    }
    let dataResponse = await fetch(url);

    if(!dataResponse.ok) {
      return; 
    }
    const data = await dataResponse.json() ; 
    const countryCode = getCountryCode(data.addressComponents); 
    console.log(countryCode);
    if(!data.currentOpeningHours) return ; 
    const hours = data.currentOpeningHours.periods; 
    console.log(tooOldCheck(hours));
    hoursCheck(hours);
    if(countryCode) {
      getHolidays(countryCode)
    }

    if(activePin == "temp") {
      localStorage.setItem(`hours-${pin.id}`,JSON.stringify(hours));
      return 
    }

    

  }


  const hoursCheck = (hours:THour[]) => {
    const today = new Date(); 
    const todayHours = hours.find(h => h.open.date.year === today.getFullYear() && h.open.date.month === today.getMonth()+1 && h.open.date.day == today.getDate())
    if(!todayHours) {
      updateHoursToday("Closed today")
      updateIsOpen(false);
      return ; 
    }
    updateIsOpen(true);
    //In Open Time
    let timeString = ""
    if (today.getHours()* 100 + today.getMinutes() < todayHours.open.hour * 100 + todayHours.open.minute) {
      updateIsOpen(false);
    }
    timeString = convertTime(todayHours.open);
    if(!todayHours.close) {
      updateIsOpen(true);
      updateHoursToday("Open 24/7");
      return ;
    }
    if(today.getHours() * 100 + today.getMinutes() > todayHours.close.hour * 100 + todayHours.close.minute) {
      updateIsOpen(false);
    }
    timeString = timeString + `-${convertTime(todayHours.close)}`;
    updateHoursToday(timeString);
  }






  
  useEffect(()=> {
    updateHoursToday("");
    updateHoliday("");
    updateIsOpen(null);
   if(!pin) return ;

    pinGet();
  },[pin])

  if(!hoursToday) return null; 
  
  return<ItemRow className={!isOpen ? styles.openOrNotClosed:""}>
    <RiTimeLine className={styles.svg}/>
    <span className={styles.openOrNot}>{hoursToday}{holiday?"*":""}</span>
    {holiday?<><br/>{holiday}</>:""}
  </ItemRow>
}

/*
 <>
    <div>{hoursToday}</div>
    <div>{isOpen?"open":"closed"}</div>
    <div>{holiday}</div>
  </>

*/