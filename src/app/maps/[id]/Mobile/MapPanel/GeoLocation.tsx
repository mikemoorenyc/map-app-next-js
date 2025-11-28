import {  memo, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import LiveMarker from "./LiveMarker";
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import DataContext from "@/app/contexts/DataContext"
import { TGeolocation, TLayer } from "@/projectTypes";


export default ({checkerData}:{checkerData:TLayer[]|null}) => {


  const map = useMap()

  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  const {geolocation,firstLoad} = activeData;
  const {layerData} = useContext(DataContext); 
  const [mapMoved,updateMapMoved] = useState(false);

  useEffect(()=> {
    boundChecker(checkerData);
  },[checkerData]);
  useEffect(()=> {
    if(firstLoad =="server")return; 
    boundChecker(checkerData);
  },[layerData])

  useEffect(()=> {
    if(!map) return ; 
    google.maps.event.addListenerOnce(map,"drag",()=> {
      console.log("move");
      updateMapMoved(true);
    })
  },[map])
  
  const boundChecker = useCallback((layerData:TLayer[]|null,geo?:{lat:number,lng:number})=> {
    if(mapMoved) return ;
    if(!layerData||!map) return null; 

    let g = geo || geolocation
    const points = layerData.map(l => l.pins).flat().map(p=>p.location);
    if(!points||!points.length) return null; 
    const mb = new google.maps.LatLngBounds();
    points.forEach(p => {
      mb.extend(p);
    })
    map.fitBounds(mb); 
    if(g&& mb.contains(g)) {
     map.setCenter(g);
     map.setZoom(15);
    }
    
  },[map,geolocation,activeDispatch,mapMoved]);






  const updatePos = useCallback((coords:{latitude:number,longitude:number}) => {
   if(!map) return ; 
    const geolocation = {
      lat:coords.latitude,
      lng:coords.longitude
    }
    activeDispatch({type:"UPDATE_GEOLOCATION",geolocation: geolocation });
    const mb = new google.maps.LatLngBounds(); 
    layerData.map(l=>l.pins).flat().forEach(p=> {
      mb.extend(p.location);
    })
    activeDispatch({type:"UPDATE_INBOUNDS",inBounds:mb.contains(geolocation)})
    
  },[map,layerData,activeDispatch])



  useEffect(()=> {
    //if(!remoteLoad) return ; 
   
    if(!navigator.geolocation) return ; 

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
      console.log(navigator.geolocation);
    navigator.geolocation.getCurrentPosition((e)=>{
  
      updatePos(e.coords);
      if(firstLoad === "server") {
        boundChecker(layerData,{
          lat:e.coords.latitude,
          lng:e.coords.longitude
        })
      }
      /*const latLng = {
        lat:e.coords.latitude,
        lng:e.coords.longitude
      }
      if(firstLoad !=="server") return ; 
      if(!latBounds )return ; 
      if(latBounds.contains(latLng)) {
        activeDispatch({type:"UPDATE_INBOUNDS",inBounds:true});
         centerMap(latLng);
      } else {
        fitter(latBounds)
      }
      */
        
      return 
      
    }, ()=>{}, options);
    const watcher = navigator.geolocation.watchPosition(throttle((e) => {
      console.log("move");
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
