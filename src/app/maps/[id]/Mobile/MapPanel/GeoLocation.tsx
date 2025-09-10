import {  memo, useContext, useEffect, useMemo, useState } from "react";
import { AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import LiveMarker from "./LiveMarker";
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import DataContext from "@/app/contexts/DataContext"


export default () => {


  const map = useMap()
  const [centerInit, updateCenterInit] = useState<"center"|"contain"|false>(false);
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  const {geolocation,firstLoad,inBounds} = activeData;
  const {layerData} = useContext(DataContext); 

 

  const latBounds = useMemo(()=> {
    const points = layerData.map(l => l.pins).flat().map(p=>p.location);
    const mb = new google.maps.LatLngBounds();
    points.forEach(p => {
      mb.extend(p);
    })
    return mb
  },[layerData])

  useEffect(()=> {
    if(!geolocation||!latBounds) return ; 
    
    if(latBounds.contains(geolocation)) {
      activeDispatch({type:"UPDATE_INBOUNDS",inBounds:true})
    }
    

  },[geolocation,activeDispatch])

  
  //DO INIT SHIT
  useEffect(()=> {
    //Move to center
    if(centerInit === "contain") return ; 
    if(map&&geolocation&&!centerInit&&latBounds) {
      //ONLY CHECK ONCE
      console.log("checked");
      updateCenterInit("center");
      if(latBounds.contains(geolocation)) {
        console.log("move to center");
        map.setZoom(15);
        map.setCenter(geolocation);
      } else {

      }
    }
    //ONLY RUN IF CenterInit
    if((firstLoad == "local"||firstLoad=="server")&&centerInit == "center"&&map) {
      console.log("firing")
      if((geolocation&& latBounds&& !latBounds.contains(geolocation))||!geolocation) {
         map?.fitBounds(latBounds);
      }
      updateCenterInit("contain");
     
    }

  },[geolocation,map,latBounds,centerInit,firstLoad])




  const updatePos = (coords:{latitude:number,longitude:number}) => {
   
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
    //if(!remoteLoad) return ; 
   
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
    
  },[])
  


  //Move to center
  /*
  useEffect(()=> {
    if(centerInit||!map||!latBounds||layerData.length<1||geolocation==null)return;
    updateCenterInit(true);
    if(latBounds.contains(geolocation)) {
      map.setZoom(15);
      map.setCenter(geolocation);
      activeDispatch({type:"UPDATE_INBOUNDS",inBounds:true})
      
    }
  },[map,geolocation,layerData,latBounds])
  */
  

 

 //

  return <>

  {geolocation && <LiveMarker geolocation={geolocation}/>}
  
  </>
}
