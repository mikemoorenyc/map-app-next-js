import {  useCallback, useContext, useEffect, useState } from "react";
import { AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import Button from "@/app/components/Button";

import { RiCompass3Line } from "@remixicon/react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import DataContext from "@/app/contexts/DataContext"

export default () => {


  const map = useMap()
  const [centerInit, updateCenterInit] = useState(false);
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  const {geolocation} = activeData;
  const {layerData} = useContext(DataContext); 
  const {remoteLoad} = activeData;

  const setInbounds = useCallback((coords)=> {
    if(!map || !activeDispatch) return ; 
    activeDispatch({type:"UPDATE_INBOUNDS",inBounds:map.getBounds().contains(coords)})
  },[map,activeDispatch])


  useEffect(()=> {
    if(!remoteLoad) return ; 
   
    if(!navigator.geolocation) return ; 

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
    const updatePOS = (e) => {
      const geolocation  = {
        lat: e.coords.latitude,
        lng: e.coords.longitude
      }
      activeDispatch({type:"UPDATE_GEOLOCATION",geolocation: geolocation });
      setInbounds(geolocation);

    }
    navigator.geolocation.getCurrentPosition(updatePOS, ()=>{}, options);
    const watcher = navigator.geolocation.watchPosition(throttle((e) => {
      updatePOS(e);
    },5000),()=>{},options);

    return () => {
      navigator.geolocation.clearWatch(watcher);
    }
    
  },[remoteLoad])
  


  //Move to center
  useEffect(()=> {
    if(centerInit) return ; 
    if(!map || geolocation == null || layerData.length < 1) return ; 
 
   updateCenterInit(true);
   setInbounds(geolocation);
   if(!map.getBounds().contains(geolocation)) return ;
   console.log("in bounds")

  map.setZoom(15)
  map.setCenter(geolocation);

    

  },[map,geolocation,layerData])
  

 

 //

  return <>

  {geolocation && <AdvancedMarker zIndex={3} position={geolocation}>
    <span className="GeoTag" style={{pointerEvents:"none"}}>💏</span>
  
  </AdvancedMarker>}
  
  </>
}
