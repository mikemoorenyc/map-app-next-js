import {  useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  const latBounds = useMemo(()=> {
    const points = layerData.map(l => l.pins).flat().map(p=>p.location);
    const mb = new google.maps.LatLngBounds();
    points.forEach(p => {
      mb.extend(p);
    })
    return mb;
  },[layerData])

  useEffect(()=> {
    if(!layerData||!geolocation) return ; 
    
    if(latBounds.contains(geolocation)) {
      activeDispatch({type:"UPDATE_INBOUNDS",inBounds:true})
    }
    

  },[latBounds,geolocation,activeDispatch])




  const updatePos = (coords) => {
   
    const geolocation = {
      lat:coords.latitude,
      lng:coords.longitude
    }
    activeDispatch({type:"UPDATE_GEOLOCATION",geolocation: geolocation });
    /*
    if(!mapBounds) return; 
    const points = layerData.map(l => l.pins).flat().map(p=>p.location);
    const mb = new google.maps.LatLngBounds();
    points.forEach(p => {
      console.log(p);
      mb.extend(p);
    })
    console.log(geolocation);
    const isInbounds = mb.contains(geolocation,true);
    console.log(isInbounds);
    
    activeDispatch({type:"UPDATE_INBOUNDS",inBounds:isInbounds})*/


  }


  useEffect(()=> {
    if(!remoteLoad) return ; 
   
    if(!navigator.geolocation) return ; 

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
    /*
    const updatePOS = (e) => {
      const geolocation  = {
        lat: e.coords.latitude,
        lng: e.coords.longitude
      }
      activeDispatch({type:"UPDATE_GEOLOCATION",geolocation: geolocation });
      setInbounds(geolocation);

    }*/
    navigator.geolocation.getCurrentPosition((e)=>{updatePos(e.coords)}, ()=>{}, options);
    const watcher = navigator.geolocation.watchPosition(throttle((e) => {
      updatePos(e.coords)
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

   if(!map.getBounds().contains(geolocation)) return ;
   console.log("in bounds")

  map.setZoom(15)
  map.setCenter(geolocation);

    activeDispatch({type:"UPDATE_INBOUNDS",inBounds:true})

  },[map,geolocation,layerData])
  

 

 //

  return <>

  {geolocation && <AdvancedMarker zIndex={3} position={geolocation}>
    <span className="GeoTag" style={{pointerEvents:"none"}}>💏</span>
  
  </AdvancedMarker>}
  
  </>
}
