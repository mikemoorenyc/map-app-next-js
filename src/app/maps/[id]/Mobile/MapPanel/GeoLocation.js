import { useContext, useEffect, useState } from "react";
import { AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import Button from "@/app/components/Button";

import { RiCompass3Line } from "@remixicon/react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext"


export default () => {

  const [heading,updateHeading] = useState(0);
  const map = useMap()
  const [centerInit, updateCenterInit] = useState(false);
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  const {geolocation} = activeData;

  useEffect(()=> {
   
    if(!navigator.geolocation) return ; 

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
    const updatePOS = (e) => {
      activeDispatch({type:"UPDATE_GEOLOCATION",geolocation:{
        lat: e.coords.latitude,
        lng: e.coords.longitude
      } })

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
    if(!map || geolocation == null) return ; 
 
   updateCenterInit(true);
   activeDispatch({type:"UPDATE_INBOUNDS",inBounds:map.getBounds().contains(geolocation)})
   if(!map.getBounds().contains(geolocation)) return ;

  map.setZoom(15)
  map.setCenter(geolocation);

    

  },[map,geolocation])
  
  const dCheck = typeof DeviceOrientationEvent;
 

 //

  return <>
  { (dCheck !== "undefined" && heading === 0) &&<Button className={"compass-icon"} onClick={setUpCompass} style={{position:"fixed", right: 24, top: 78} } modifiers={["sm","icon","secondary","round"]}>
  <RiCompass3Line/>
  </Button>}
  {geolocation && <AdvancedMarker position={geolocation}>
    <span className="GeoTag" style={{pointerEvents:"none", transform: `rotate(${heading}deg)`}}>💏</span>
  
  </AdvancedMarker>}
  
  </>
}