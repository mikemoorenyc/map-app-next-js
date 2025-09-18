import {  memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import LiveMarker from "./LiveMarker";
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import DataContext from "@/app/contexts/DataContext"
import { TGeolocation } from "@/projectTypes";


export default () => {


  const map = useMap()

  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  const {geolocation,firstLoad} = activeData;
  const {layerData} = useContext(DataContext); 

 

  const latBounds = useMemo(()=> {
    const points = layerData.map(l => l.pins).flat().map(p=>p.location);
    if(!points||!points.length) return null; 
    const mb = new google.maps.LatLngBounds();
    points.forEach(p => {
      mb.extend(p);
    })
    return mb
  },[layerData])

  useEffect(()=> {
    if(!geolocation||!latBounds||firstLoad === "server"||!map) return ; 
    
    if(latBounds.contains(geolocation)) {
      activeDispatch({type:"UPDATE_INBOUNDS",inBounds:true});
      centerMap(geolocation);
      return 
    }
    map.fitBounds(latBounds);
    

  },[geolocation,activeDispatch,firstLoad,latBounds,map])

  const centerMap=useCallback((geolocation:TGeolocation)=> {
    if(!map)return ; 
    map.setZoom(15);
    map.setCenter(geolocation);
  },[map])
 

  //Center if out of bounds twice 
  




  const updatePos = (coords:{latitude:number,longitude:number}) => {
   
    const geolocation = {
      lat:coords.latitude,
      lng:coords.longitude
    }
    activeDispatch({type:"UPDATE_GEOLOCATION",geolocation: geolocation });
  }


  useEffect(()=> {
    //if(!remoteLoad) return ; 
   
    if(!navigator.geolocation) return ; 

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
    navigator.geolocation.getCurrentPosition((e)=>{
      updatePos(e.coords)
    }, ()=>{}, options);
    const watcher = navigator.geolocation.watchPosition(throttle((e) => {
      updatePos(e.coords)
    },5000),()=>{},options);

    return () => {
      navigator.geolocation.clearWatch(watcher);
    }
    
  },[])
  



  return <>

  {geolocation && <LiveMarker geolocation={geolocation}/>}
  
  </>
}
