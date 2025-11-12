const openOrClosedLegacy = () => {

  const [isOpen,updateIsOpen] = useState(false); 
  const [hoursToday,updateHoursToday] = useState(null);
  const [holiday,updateHoliday] = useState("");
  
  const dateDiff(today,checkDate) => {
    const check = new Date(checkDate) ;
    let diff = today - check 
    return diff / (1000 * 3600 * 24);

  }

  const convertMilitary(time) => {
    if(!time.length < 4) {
      throw new Error("wrong length"); 
    }
    const hour = parseInt(time.charAt(0) + time.charAt(1)); 
    const hourString = time.charAt(0)+time.charAt(1); 
    const minute = time.charAt(2)+time.charAt(3); 
    if(hour === 0) {
      return `12:${minute}am`
    }
    if(hour < 13) {
      return `${hourString}:${minute}${hour === 12?'pm':'am'}`
    }
    return `${hour - 12}:${minute}pm`;
  }


  useEffect(()=> {
    updateHoursToday(null); 
    let hoursSaved = localStorage.getItem("hours"); 
    if(!hoursSaved) return ; 
    const {hours} = JSON.parse(hoursSaved); 
    const business = hours.find(h => h.id == place.id);
    if(!business) return ; 
    const today = new Date(); 
    if(dateDiff(today,business.savedDate) > 5) return ; 

    const todayHours = business.periods.find(p => p.open.day == today.getDay()); 
    if(!todayHours) {
      updateIsOpen(false);
      updateHoursToday("Closed today"); 
      return ;
    }
    if(!todayHours.close && todayHours.open.time === "0000") {
      updateHoursToday("Open 24 hrs"); 
      updateIsOpen(true);
      return 
    } 
    const todayMilitary = today.getHours() * 100 + today.getMinutes(); 
    if(todayMilitary <= parseInt(todayHours.close.time) && todayMilitary >= parseInt(todayHours.open.time)) {
      updateIsOpen(true);
    } else {
      updateIsOpen(false);
    }
    updateHoursToday(`${convertMilitary(todayHours.open.time)} - ${convertMilitary(todayHours.close.time}`);
    
    
  },[])

}
