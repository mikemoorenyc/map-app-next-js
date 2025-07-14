import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";

import { updateMap,getMap } from "@/app/actions/maps";

import styles from "./styles.module.css"
import { RiUploadCloudLine } from "@remixicon/react";

const Updater = ({id})=> {
  const {layerData,pageTitle,mapId,layerDispatch,mapIcon,updateMapIcon,updatePageTitle} = useContext(DataContext);
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const [firstRun,updateFirstRun] = useState("uninit");
  //Try to get local data first 
  useEffect(()=> {
    if(!mapId || firstRun !== "uninit") return ;
    const localStore = process.env.NEXT_PUBLIC_LOCAL_MAP;
    const listData = localStorage.getItem(localStore);
   
    if(listData && typeof JSON.parse(listData) == "object" && JSON.parse(listData).all.find(m=>m.id == mapId)) {
      const theMap = JSON.parse(listData).all.find(m=>m.id == mapId);
     
      layerDispatch({
          type: "REFRESH_LAYERS",
          newLayers: theMap.layerData
      })
      if(theMap.mapIcon) {
        updateMapIcon(theMap.mapIcon)
      }
      updatePageTitle(theMap.title);

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
    console.log(updated);
    updateIsSaving(false);
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