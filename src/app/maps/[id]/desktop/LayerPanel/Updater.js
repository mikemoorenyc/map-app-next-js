import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";
import { updateMap } from "@/app/actions/maps";

const Updater = ({id})=> {
  const {layerData,pageTitle,mapId} = useContext(DataContext);
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const firstRun = useRef(true);
  const sendData = async () => {
    let updated = await updateMap(mapId,pageTitle,layerData);
    console.log(updated);
    updateIsSaving(false);
    updateLastSaved(new Date())
  }

  useEffect(()=> {
    if(!mapId) return; 
    if(firstRun.current) {
      firstRun.current = false; 
      return ; 
    }
   
    const updateLocal = setTimeout(()=> {
      updateIsSaving(true);
      sendData();
    },3* 1000)
    return () => {
      clearTimeout(updateLocal);
    }

  },[layerData, pageTitle])


  const dateString = `${lastSaved.getFullYear()}/${lastSaved.getMonth()}/`
  return <div className={"Updater"} style={{flex:1, fontSize: "12px"}}>{isSaving? "Saving...":""}</div>

}

export default Updater