import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";
import useMapMover from "@/_lib/useMapMover"

import { updateMap,getMap } from "@/app/actions/maps";

import styles from "./styles.module.css"
import { RiUploadCloudLine } from "@remixicon/react";

const Updater = ({id,firstLoadFunction})=> {
  const {layerData,pageTitle,mapId,layerDispatch,mapIcon,updateMapIcon,updatePageTitle} = useContext(DataContext);
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const [firstRun,updateFirstRun] = useState("uninit");
  const mapMover = useMapMover(); 
 

  //Try to get local data first 
  useEffect(()=> {
    if(!mapId || firstRun !== "uninit") return ;
   // const localStore = process.env.NEXT_PUBLIC_LOCAL_MAP;
   // const listData = localStorage.getItem(localStore);
   const listData = localStorage.getItem('map-'+mapId); 
    if(listData && typeof JSON.parse(listData) == "object" ) {
      const theMap = JSON.parse(listData);
      const pins = theMap.layerData.map(l => l.pins).flat()
      if(pins.length > 0) {
        mapMover("contain",pins);
      } else {
        mapMover("move",null,[40.7484405,-73.9856644])
      }
      
      
     
      layerDispatch({
          type: "REFRESH_LAYERS",
          newLayers: theMap.layerData
      })
      if(theMap.mapIcon) {
        updateMapIcon(theMap.mapIcon)
      }
      updatePageTitle(theMap.pageTitle);

    }
    updateFirstRun("local");
  },[mapId,firstRun])
  //FirstFetch 
  useEffect(()=> {
    const firstFetch = async() => {
      const theMap = await getMap(parseInt(mapId));
      if(theMap) {
        layerDispatch({
          type: "REFRESH_LAYERS",
          newLayers: theMap.layerData
        })
        const pins = theMap.layerData.map(l => l.pins).flat()
    
        if(pins.length > 0) {
        mapMover("contain",pins);
      } else {
        mapMover("move",null,[40.7484405,-73.9856644])
      }
        if(firstLoadFunction) {
          firstLoadFunction(); 
        }
        if(theMap.mapIcon) {
          updateMapIcon(theMap.mapIcon)
        }
        updatePageTitle(theMap.title);

      }
      console.log(theMap);
      setTimeout(()=> {
        updateFirstRun("server");
      },1000)
    }
    if(firstRun!=="local" || !mapId) return ;
    firstFetch(); 
    
  },[firstRun,mapId])
  
  const sendData = async () => {
    let updated = await updateMap(parseInt(mapId),pageTitle,layerData,mapIcon);
    updateIsSaving(false);
    localStorage.setItem('map-'+mapId, JSON.stringify({layerData:layerData,mapIcon:mapIcon,pageTitle:pageTitle}));
    updateLastSaved(new Date())
  }
  /*
  useEffect(()=> {
    const getFirstData = async () => {

      const freshData = await getMap(mapId);
      console.log(freshData);
      if(freshData) {
        layerDispatch({
          type: "REFRESH_LAYERS",
          newLayers: freshData.layerData
        })
      }
    }
   // getFirstData();
  },[])
*/
  useEffect(()=> {
    if(!mapId) return; 
    if(firstRun !== "server") return ; 
    console.log("check");

   
    const updateLocal = setTimeout(()=> {
      updateIsSaving(true);
      sendData();
    },3* 1000)
    return () => {
      clearTimeout(updateLocal);
    }

  },[layerData, pageTitle,mapIcon])
  


  const dateString = `${lastSaved.getFullYear()}/${lastSaved.getMonth()}/`
  return <div
  style={{
    visibility: isSaving ? "visible": "hidden"
  }}
   className={`${styles.updater}  border-1 flex-center`}><RiUploadCloudLine width={12} height={12} /></div>

}

export default Updater