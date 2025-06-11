import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import { useContext,useEffect,useState,useCallback } from "react"

export default function ()  {
  const {activeDispatch, activeData} = useContext(MobileActiveContext)
  const {tempData,activePin,geolocation,inBounds} = activeData;
  const {layerData} = useContext(DataContext);
  const map = useMap(); 
  const routesLibrary = useMapsLibrary('routes');
  const [dirService,updateDirService] = useState(null); 
  
  useEffect(()=> {
    if(!map || !routesLibrary)return ; 
    updateDirService(new routesLibrary.DirectionsService());
    console.log("created")
  },[map,routesLibrary]);
  
  const updateData = useCallback(async (mode) => {
     if (!dirService || !geolocation || !inBounds) return;
     const pin = activePin == "temp" ? tempData : layerData.map(l=>l.pins).flat().find(pin => pin.id == activePin);
     console.log(pin.place_id);
     if(!pin) return; 
     dirService.route({
      origin: `${geolocation.lat},${geolocation.lng}`,
      destination:  `${pin.location.lat},${pin.location.lng}`,
      travelMode: google.maps.TravelMode[mode]
     })
     .then(response => {
    
      if(!activePin) return; 
      if(response.status !== "OK") return ; 
      console.log(response);
      const newget = {};
      newget[mode]= response.routes[0].legs[0].duration
      activeDispatch({
        type:"SET_ROUTES",
        updatedRoute: newget
      })
     })
  },[activeDispatch,dirService,geolocation,inBounds,layerData,activePin,tempData])

  useEffect(()=> {
    activeDispatch({
      type: "SET_ROUTES",
      reset: true
    })
    if(!activePin) return ; 
    ["DRIVING","TRANSIT","BICYCLING","WALKING"].forEach((e)=> {
      updateData(e)
    })
  },[activePin])

  return <></>
}
