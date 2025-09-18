import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";


import { updateMap,getMap } from "@/app/actions/maps";

import styles from "./styles.module.css"
import { RiUploadCloudLine } from "@remixicon/react";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import { useMyPresence,useBroadcastEvent,useEventListener,useOthers,useSelf,shallow} from "@liveblocks/react/suspense";
import { TLayer } from "@/projectTypes";
import { useOthersMapped } from "@liveblocks/react";


type TProps = {
  firstLoadFunction?:Function,
  checkDeleted:Function
}

const UpdaterLive = ({firstLoadFunction,checkDeleted}:TProps)=> {

  const {layerData,pageTitle,mapId,layerDispatch,mapIcon,updateMapIcon,updatePageTitle} = useContext(DataContext);
  
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const [firstRun,updateFirstRun] = useState("uninit");
  const updateLocal = useRef<number|null>(null);
  const [myPresence,updateMyPresence] = useMyPresence(); 
  const broadcast = useBroadcastEvent() 
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
  useEffect(()=> {
    if(!mapId || firstRun !== "uninit") return ;
    
    updateFirstRun("local");
    if(firstLoadFunction) firstLoadFunction("local",layerData)
  },[mapId,firstRun]);



  //FirstFetch 
  useEffect(()=> {
    
    if(firstRun !=="local") return; 
    console.log("server fetch");
    
    const firstFetch = async() => {
 
      const theMap = await getMap(mapId);
      let layerData:TLayer[] =[];
      if(theMap) {
        layerData=theMap.layerData; 
        layerDispatch({
          type: "REFRESH_LAYERS",
          newLayers: theMap.layerData
        })
        
      
        
        
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
    console.log('send to server');
    let updated = await updateMap(mapId,pageTitle,layerData,mapIcon);
    updateMyPresence({
      savePending: false
    })
    updateIsSaving(false);
    localStorage.setItem('map-'+mapId, JSON.stringify({layerData:layerData,mapIcon:mapIcon,pageTitle:pageTitle}));
    updateLastSaved(new Date())
  }

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
  const someoneSavePending = useOthers((others) =>
      others.some((other) => other.presence.savePending)
  );
  const someoneSaving = someoneSavePending || myPresence.savePending; 

  useEffect(()=> {
    if(!mapId) return; 
    if(firstRun !== "server") return ; 
    
 
    //MY JOB TO SAVE, anything changed. I have to save it
    if(myPresence.savingDuties&& someoneSaving) {
      console.log('timeout started');
      updateLocal.current = window.setTimeout(()=> {
      updateIsSaving(true);
      sendData();
    },3* 1000)

    } else {
      if(updateLocal.current !== null) {
        clearTimeout(updateLocal.current);
      }
    }
    
    //CHECK IF I HAVE TO BROADCAST UPDATE
    
    //SOMEONE ELSE HAS A SAVE PENDING, don't broadcast
    if(someoneSavePending) {
      updateMyPresence({savePending:false});
      
    }
    
    //I have a save pending, send broadcast
    //SEND UPDATED DATA
    
    if(myPresence.savePending && !someoneSavePending) {
      console.log("broadcast");
       broadcast({
        type:"UPDATE_DATA",
        data: {layerData,pageTitle,mapIcon}
      })
      updateMyPresence({savePending:false})

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
  

  return <div
  style={{
    visibility: isSaving ? "visible": "hidden"
  }}
   className={`${styles.updater}  border-1 flex-center`}><RiUploadCloudLine size={12} /></div>

}

export default (props:TProps)=><ClientSideSuspense fallback={<div></div>}><UpdaterLive {...props}/></ClientSideSuspense>