import {  memo, useCallback, useRef, useContext, useEffect, useMemo, useState } from "react";
import { AdvancedMarker,useMap ,Pin} from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle"
import LiveMarker from "./LiveMarker";

import DataContext from "@/app/contexts/DataContext"
import { TGeolocation, TLayer } from "@/projectTypes";
import { useLayers } from "@/app/lib/useLayerData";
import useActiveStore from "@/app/contexts/useActiveStore";


export default ({checkerData}:{checkerData:TLayer[]|null}) => {

  const map = useMap()
  const geolocation = useActiveStore(s=>s.geolocation);
  const firstLoad = useActiveStore(s=>s.firstLoad);
  const {nonEditing} = useContext(DataContext);
  const layerData = useLayers(); 
  const updateGeolocation = useActiveStore(s=>s.updateGeolocation);
  const updateInBounds = useActiveStore(s=>s.updateInBounds)
  const [mapMoved,updateMapMoved] = useState(false);
  const inBounds = useActiveStore(s=>s.inBounds);
  const layerDataRef = useRef(layerData);
  const mapRef = useRef(map);
  useEffect(() => {
    layerDataRef.current = layerData;
    if(!navigator.geolocation) return ;
    navigator.geolocation.getCurrentPosition((e)=> {
      updatePos(e.coords);
    })
  }, [layerData]);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);


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
    
  },[map,geolocation,mapMoved]);






  const updatePos = useCallback((coords:{latitude:number,longitude:number}) => {
    const map = mapRef.current;
    const layerData = layerDataRef.current;
   if(!map) return ; 
    const geolocation = {
      lat:coords.latitude,
      lng:coords.longitude
    }
    updateGeolocation(geolocation);

    const mb = new google.maps.LatLngBounds(); 
    layerData.map(l=>l.pins).flat().forEach(p=> {
      mb.extend(p.location);
    })
 
    updateInBounds(mb.contains(geolocation))
   
    
  },[])



  useEffect(()=> {
    //if(!remoteLoad) return ; 
   
    if(!navigator.geolocation) return ; 
    

    const options = {
       enableHighAccuracy: true,
       timeout: 5000,
        maximumAge: 0,
      }
      
    navigator.geolocation.getCurrentPosition((e)=>{
  
      updatePos(e.coords);
      if(firstLoad === "server") {
        boundChecker(layerData,{
          lat:e.coords.latitude,
          lng:e.coords.longitude
        })
      } 
      return 
      
    }, ()=>{}, options);
    const watcher = navigator.geolocation.watchPosition(throttle((e) => {
      console.log("move");
      updatePos(e.coords)
    },5000),()=>{},options);

    navigator.geolocation.getCurrentPosition((e)=> {
      if(!e.coords) return ; 
      updatePos(e.coords);
    });

    return () => {
      navigator.geolocation.clearWatch(watcher);
    }
    
  },[])
  



  return <>
  {geolocation && nonEditing&& <AdvancedMarker position={geolocation}>
    <Pin  borderColor={"#ffffff"} glyph={"😊"} scale={.7} background={"#000000"} glyphColor={"#ffffff"}/>
    </AdvancedMarker>}
  {(geolocation && !nonEditing)&& <LiveMarker geolocation={geolocation}/>}
  
  </>
}
