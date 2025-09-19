import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import MobileActiveContext, { TRoute } from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import { useContext,useEffect,useState,useCallback } from "react"

export default function ()  {
  const {activeDispatch, activeData} = useContext(MobileActiveContext)
  const {tempData,activePin,geolocation,inBounds} = activeData;
  let {layerData} = useContext(DataContext);
  const map = useMap(); 
  const routesLibrary = useMapsLibrary('routes');
  const [dirService,updateDirService] = useState<google.maps.DirectionsService|null>(null); 
  useEffect(()=> {
    if(!map || !routesLibrary)return ; 
    updateDirService(new routesLibrary.DirectionsService());
    console.log("created")
  },[map,routesLibrary]);
  
  const updateData = useCallback(async (mode:keyof typeof google.maps.TravelMode) => {
     if (!dirService || !geolocation || !inBounds) return;
     const pin = activePin == "temp" ? tempData : layerData.map(l=>l.pins).flat().find(pin => pin.id == activePin);

     if(!pin) return; 
     dirService.route({
      origin: `${geolocation.lat},${geolocation.lng}`,
      destination:  `${pin.location.lat},${pin.location.lng}`,
      travelMode: google.maps.TravelMode[mode]
     })
     .then(response => {
    
      if(!activePin) return; 
      if(!response.routes) return ; 
 
      
     
      const newget = response.routes[0].legs[0].duration
      activeDispatch({
        type:"SET_ROUTES",
        updatedRoute: {
          TRANSIT: newget
        } 
      })
     })
  },[dirService,geolocation,inBounds,activePin,tempData,layerData,activeDispatch])

  useEffect(()=> {
    activeDispatch({
      type: "SET_ROUTES",
      reset: true
    })
    if(!activePin) return ; 
    ["TRANSIT"].forEach((e)=> {
      updateData("TRANSIT")
    })
  },[activePin])

  return <></>
}