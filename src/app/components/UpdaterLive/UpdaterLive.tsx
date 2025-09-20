import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";


import { updateMap,getMap } from "@/app/actions/maps";

import styles from "./styles.module.css"
import { RiUploadCloudLine } from "@remixicon/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { useMyPresence,useEventListener,useOthers,useSelf,shallow,useMutation,useStorage} from "@liveblocks/react/suspense";
import { TLayer } from "@/projectTypes";
import { useOthersMapped } from "@liveblocks/react";


type TProps = {
  firstLoadFunction?:Function,
  checkDeleted:Function
}

const UpdaterLive = ({firstLoadFunction,checkDeleted}:TProps)=> {

  const {mapId} = useContext(DataContext);
  
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const [firstRun,updateFirstRun] = useState("uninit");
  const updateLocal = useRef<number|null>(null);
  const [myPresence,updateMyPresence] = useMyPresence(); 
  
const someoneHasSavingDuties = useOthers((others) =>
  others.some((other) => other.presence.savingDuties)
) || myPresence.savingDuties;


const myConnection = useSelf((me)=>me.connectionId);
const othersMapped = useOthersMapped(
  (other) => ({
    isVisible: other.presence.isVisible
  }),
  shallow // 👈
);

 //if noone has saving duties, set yourself
 useEffect(()=> {
  if(someoneHasSavingDuties) return ; 
  //NOONE ELSE HERE
  if(!someoneHasSavingDuties && othersMapped.length < 1) {
    console.log("you're saving");
    updateMyPresence({savingDuties:true})
    return ; 
  }
  let highNumber = myPresence.isVisible?  myConnection:0;
  othersMapped.forEach(o => {
    if(!o[1].isVisible) return ;
    if(o[0] > highNumber) {
      highNumber = o[0]
    }
  })
  if(highNumber === myConnection) {
    console.log("youre saving");
    updateMyPresence({savingDuties:true})
  }

 },[someoneHasSavingDuties])
 

  //Try to get local data first 
  
  const storage = useStorage((root)=>root.map);
  const {pageTitle,layerData,mapIcon} = storage; 
 const update =  useMutation(
  // Mutation context is passed as the first argument
  ({ storage },map:{layerData:TLayer[],pageTitle:string,mapIcon?:string}) => {
    // Mutate Storage
    storage.get("map").set("layerData",map.layerData)
    storage.get("map").set("pageTitle",map.pageTitle)
    if(map.mapIcon) {
      storage.get("map").set("mapIcon",map.mapIcon);
    }
  },
  []
);

  //FirstFetch 
  useEffect(()=> {

    if(pageTitle||layerData.length) {
      console.log("already data",pageTitle);
      if(firstLoadFunction)firstLoadFunction("server",layerData)
       updateFirstRun("server");
       localStorage.setItem('map-'+mapId,JSON.stringify({
        pageTitle:pageTitle,
        mapIcon,layerData
      }))
      return ;     
    }

    const firstFetch = async() => {
      
      const theMap = await getMap(mapId);
      
      if(!theMap)return ; 
      const{title,layerData,mapIcon} = theMap;
      update({layerData,mapIcon,pageTitle:title})
      localStorage.setItem('map-'+mapId,JSON.stringify({
        pageTitle:title,
        mapIcon,layerData
      }))


      console.log("babies")

      if(firstLoadFunction){
        firstLoadFunction("server",layerData)
      }
     
      setTimeout(()=> {
        console.log("update to server");
        updateFirstRun("server");
      },1000)
      
    }
    
    
    firstFetch(); 
    
    
  },[])
  
  const sendData = async () => {
    console.log('send to server');
    let updated = await updateMap(mapId,pageTitle,layerData,mapIcon);
    updateMyPresence({
      savePending: false
    })
    updateIsSaving(false);
    localStorage.setItem('map-'+mapId, JSON.stringify({layerData:layerData,mapIcon:mapIcon,pageTitle:pageTitle}));
    updateLastSaved(new Date())
  }

  


  useEffect(()=> {
    console.log(firstRun,myPresence.savingDuties,layerData,pageTitle,mapIcon)
    if(!mapId) return; 
    if(firstRun !== "server") return ; 
    
    if(myPresence.savingDuties) {
      updateLocal.current = window.setTimeout(()=> {
        updateIsSaving(true);
        sendData();
       },3* 1000)
    }
 
   return () => {
    if(updateLocal.current !== null) {
      clearTimeout(updateLocal.current);
    }
   }
    

  },[layerData, pageTitle,mapIcon])

  //UPDATE DOCUMENT TITLE
  useEffect(()=> {
    if(!document) return ; 
    document.title = `${mapIcon}${pageTitle} - Map App`
  },[mapIcon,pageTitle])

  //VISIBILITY UPDATE
  /*
  const grabFreshContent = async () => {
    const state = document.visibilityState;
    console.log(document.visibilityState);
    
    if(state !=="visible") {
      updateMyPresence({savingDuties:false,isVisible:false})
      
      return ; 
    }
    updateMyPresence({isVisible:true});
    console.log('fetch on visible');
    const theMap = await getMap(mapId);
    if(!theMap) return ; 
    layerDispatch({
      type:"REFRESH_LAYERS",
      newLayers: theMap.layerData 
    })
    updatePageTitle(theMap.title);
    if(theMap.mapIcon) {
      updateMapIcon(theMap.mapIcon);
    }

  }
  useEffect(()=> {
    document.addEventListener('visibilitychange',grabFreshContent);

    return () => {
      document.removeEventListener("visibilitychange",grabFreshContent);
    }

  },[])
  */
  

  return <div
  style={{
    visibility: isSaving ? "visible": "hidden"
  }}
   className={`${styles.updater}  border-1 flex-center`}><RiUploadCloudLine size={12} /></div>

}

export default (props:TProps)=><ClientSideSuspense fallback={<div></div>}><UpdaterLive {...props}/></ClientSideSuspense>