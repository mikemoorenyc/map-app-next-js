import { useState,useContext,useEffect,useRef } from "react";
import DataContext from "@/app/contexts/DataContext";
import { updateMap,getMap } from "@/app/actions/maps";
import { FloppyDiskArrowIn } from "iconoir-react";
import styles from "./styles.module.css"

const Updater = ({id})=> {
  const {layerData,pageTitle,mapId,layerDispatch} = useContext(DataContext);
  const [lastSaved,updateLastSaved] = useState(new Date());
  const [isSaving,updateIsSaving] = useState(false)
  const [firstRun,updateFirstRun] = useState(true);
  const sendData = async () => {
    let updated = await updateMap(mapId,pageTitle,layerData);
    console.log(updated);
    updateIsSaving(false);
    updateLastSaved(new Date())
  }
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

  useEffect(()=> {
    if(!mapId) return; 
    if(firstRun) {
      updateFirstRun(false)
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
  return <div
  style={{
    visibility: isSaving ? "visible": "hidden"
  }}
   className={`${styles.updater}  border-1 flex-center`}><FloppyDiskArrowIn width={12} height={12} /></div>

}

export default Updater