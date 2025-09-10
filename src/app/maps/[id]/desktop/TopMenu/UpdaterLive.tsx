import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";
import useMapMover from "@/app/lib/useMapMover"

import { updateMap,getMap } from "@/app/actions/maps";

import styles from "./styles.module.css"
import { RiUploadCloudLine } from "@remixicon/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { useMyPresence,useBroadcastEvent,useEventListener} from "@liveblocks/react/suspense";
import { TLayer } from "@/projectTypes";

type TProps = {
  firstLoadFunction?:Function,
  checkDeleted:Function
}

const UpdaterLive = ({firstLoadFunction,checkDeleted}:TProps)=> {

  const {layerData,pageTitle,mapId,layerDispatch,mapIcon,updateMapIcon,updatePageTitle} = useContext(DataContext);
  
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const [firstRun,updateFirstRun] = useState("uninit");
  const mapMover = useMapMover(); 
  const [myPresence,updateMyPresence] = useMyPresence(); 
  const broadcast = useBroadcastEvent() 
 

  //Try to get local data first 
  useEffect(()=> {
    if(!mapId || firstRun !== "uninit") return ;
    console.log("local fetch");
    let layerData:TLayer[] = [];
   // const localStore = process.env.NEXT_PUBLIC_LOCAL_MAP;
   // const listData = localStorage.getItem(localStore);
   const listData = localStorage.getItem('map-'+mapId); 
    if(listData && typeof JSON.parse(listData) == "object" ) {
      const theMap = JSON.parse(listData);
      layerData = theMap.layerData;

      
      
     
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
    if(firstLoadFunction) firstLoadFunction("local",layerData)
  },[mapId,firstRun])

  //FirstFetch 
  useEffect(()=> {
    if(firstRun !=="local") return; 
    console.log("server fetch");
    
    const firstFetch = async() => {
      console.log(pageTitle);
      const theMap = await getMap(mapId);
      let layerData:TLayer[] =[];
      if(theMap) {
        layerData=theMap.layerData; 
        layerDispatch({
          type: "REFRESH_LAYERS",
          newLayers: theMap.layerData
        })
        const pins = theMap.layerData.map(l => l.pins).flat()
      
        
        
        if(theMap.mapIcon) {
          updateMapIcon(theMap.mapIcon)
        }
        updatePageTitle(theMap.title);

      }
      if(firstLoadFunction)firstLoadFunction("server",layerData);
     
      setTimeout(()=> {
        updateFirstRun("server");
      },1000)
    }
    
    firstFetch(); 
    
    
  },[firstRun,mapId])
  
  const sendData = async () => {
    let updated = await updateMap(mapId,pageTitle,layerData,mapIcon);
    updateMyPresence({
      savePending: false
    })
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

  //LISTEN FOR DATA UPDATES
  useEventListener(({event})=> {
    if(!event) return ; 
    if(event.type !== "UPDATE_DATA") return ; 
    const ldTemp = event.data.layerData
    const {pageTitle,mapIcon} = event.data;
    //DEACTIVATE ANY DELETED ITEMS
    checkDeleted(ldTemp,layerData); 

    layerDispatch({
      type:"REFRESH_LAYERS",
      newLayers: ldTemp
    })
    updatePageTitle(pageTitle);
    if(mapIcon) updateMapIcon(mapIcon); 
    localStorage.setItem('map-'+mapId, JSON.stringify({layerData:ldTemp,mapIcon:mapIcon,pageTitle:pageTitle}));
  })

  useEffect(()=> {
    if(!mapId) return; 
    if(firstRun !== "server") return ; 
    console.log("check");
    //DIDN'T MAKE UPDATE, DO NOTHING
    if(!myPresence.savePending) return ;  

    //SEND UPDATED DATA
    broadcast({
      type:"UPDATE_DATA",
      data: {layerData,pageTitle,mapIcon}
    })

   
    const updateLocal = setTimeout(()=> {
      updateIsSaving(true);
      sendData();
    },3* 1000)
    return () => {
      clearTimeout(updateLocal);
    }

  },[layerData, pageTitle,mapIcon])

  //UPDATE DOCUMENT TITLE
  useEffect(()=> {
    if(!document) return ; 
    document.title = `${mapIcon}${pageTitle} - Map App`
  },[mapIcon,pageTitle])
  


  const dateString = `${lastSaved.getFullYear()}/${lastSaved.getMonth()}/`
  return <div
  style={{
    visibility: isSaving ? "visible": "hidden"
  }}
   className={`${styles.updater}  border-1 flex-center`}><RiUploadCloudLine size={12} /></div>

}

export default (props:TProps)=><ClientSideSuspense fallback={<div></div>}><UpdaterLive {...props}/></ClientSideSuspense>