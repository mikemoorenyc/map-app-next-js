import { use, useEffect, useState } from "react";
import { AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import Button from "@/app/components/Button";
import { Compass } from "iconoir-react";
import mapCenterer from "../lib/mapCenterer";

export default () => {
  const [currentLocation, updateCurrentLocation] = useState(null);
  const [heading,updateHeading] = useState(0);
  const map = useMap()
  const [centerInit, updateCenterInit] = useState(false);

  useEffect(()=> {
   
    if(!navigator.geolocation) return ; 

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
    const updatePOS = (e) => {
    
      updateCurrentLocation({
        lat: e.coords.latitude,
        lng: e.coords.longitude
      })
    }
    navigator.geolocation.getCurrentPosition(updatePOS, ()=>{}, options);
    const watcher = navigator.geolocation.watchPosition(throttle((e) => {
      updatePOS(e);
    },10000),()=>{},options);

    return () => {
      navigator.geolocation.clearWatch(watcher);
    }
    
  },[])
  

  const setUpCompass = (e) => {
    e.preventDefault(); 
    DeviceOrientationEvent.requestPermission()
      .then(
        (response) => {
            if(response == "granted") {
              console.log("granted");
              window.addEventListener("deviceorientation",throttle((e) => {
                let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
            
                   updateHeading(compass);
               
              },5000) , true);
            } else {
              alert("has to be allowed!");
          }
            
        }
      )
  }

  //Move to center
  useEffect(()=> {
    if(centerInit) return ; 
    if(!map || currentLocation == null) return ; 
 
   updateCenterInit(true);
   if(!map.getBounds().contains(currentLocation)) return ;

  map.setZoom(15)
  map.setCenter(currentLocation);

    

  },[map,currentLocation])
  
  

 

  return <>
  {(DeviceOrientationEvent.requestPermission && heading === 0) && <Button onClick={setUpCompass} style={{position:"fixed", right: 24, top: 74} } modifiers={["sm"]}>
  <Compass />
  </Button>}
  {currentLocation && <AdvancedMarker position={currentLocation}>
    <span className="GeoTag" style={{pointerEvents:"none", transform: `rotate(${heading}deg)`}}>💏</span>
  
  </AdvancedMarker>}
  
  </>
}