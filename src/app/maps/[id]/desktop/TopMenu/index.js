'use client'
import { createPortal } from "react-dom";
import UpdaterLive from "./UpdaterLive";
import { useContext, useEffect,useState } from "react";
import styles from "./styles.module.css";
import ActiveContext from "@/app/contexts/ActiveContext";
import Button from "@/app/components/Button";
import { RiMap2Line } from "@remixicon/react";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";



const TopMenu = () => {
  const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);
  const {activeDispatch,activeData} = useContext(ActiveContext)
  const {editingLayer,activeLayer,editingPin,hoveringPin} = activeData;
  const [isMounted,updateIsMounted] = useState(false)
  useEffect(()=> {
    updateIsMounted(true);

  },[])

  const checkDeleted = (layerData) => {
    if(!editingLayer && !activeLayer && !editingPin && !hoveringPin) return; 
    const pinIds = layerData.map(l => l.pins).flat().map(p=>p.id);
    const layerIds = layerData.map(l=>l.id)
    
    //ACTIVE LAYER DELETED - Remove from active and shut off active pin
    if(!layerIds.includes(activeLayer) ) {
      activeDispatch({
        type:"ACTIVE_LAYER",
        id: null
      })
      activeDispatch({type:"EDITING_PIN",id:null})
    }
    //SEARCH IS OPEN, SET TO TOPMOST OF NEW LAYERSET
    if(editingPin === null & infoWindowState.infoWindowShown) {
      activeDispatch({
        type: "ACTIVE_LAYER",
        id: layerData[0].id
      })
    }
    //HOVERING PIN GOT DELETED 
    if(!pinIds.includes(hoveringPin) ){
      activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})
    }
    //ONE OF THE SAVED PINS IS CURRENTLY OPEN and deleted
    if(editingPin !== null && !pinIds.includes(editingPin)) {
      activeDispatch({type:"EDITING_PIN",id:null});
      activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})
      infoWindowDispatch({type:"CLOSE_WINDOW"});
    }
  }

  return isMounted && <>
  {createPortal(
  <div className={`${styles.topMenu} `}>
    <UpdaterLive id={"asdsd"} checkDeleted={checkDeleted}/>
    <Button
    icon={<RiMap2Line />}
    href={"/"}
    modifiers={["secondary","sm"]}
    >
    All maps
    </Button>

  </div>  
  
   , document.getElementById("menu-container")
   )}
  </>
}
export default TopMenu