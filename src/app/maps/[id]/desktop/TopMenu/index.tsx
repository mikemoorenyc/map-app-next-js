'use client'
import PortalContainer from "@/app/components/PortalContainer/PortalContainer";
import UpdaterLive from "./UpdaterLive";
import { useCallback, useContext, useEffect,useState } from "react";
import styles from "./styles.module.css";
import ActiveContext from "@/app/contexts/ActiveContext";
import Button from "@/app/components/Button";
import { RiMap2Line } from "@remixicon/react";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import { TLayer } from "@/projectTypes";
import useMapMover from "@/app/lib/useMapMover";
import useLayerData from "@/app/lib/useLayerData";



const TopMenu = () => {
  const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);
  const {activeDispatch,activeData} = useContext(ActiveContext)
  const {editingLayer,activeLayer,editingPin,hoveringPin} = activeData;
  const [isMounted,updateIsMounted] = useState(false)
  useEffect(()=> {
    updateIsMounted(true);

  },[])

  const checkDeleted = (layerData:TLayer[]) => {
    if(!editingLayer && !activeLayer && !editingPin && !hoveringPin) return; 
    const pinIds = layerData.map(l => l.pins).flat().map(p=>p.id);
    const layerIds = layerData.map(l=>l.id)
    
    //ACTIVE LAYER DELETED - Remove from active and shut off active pin
    if(activeLayer != null && !layerIds.includes(activeLayer) ) {
      activeDispatch({
        type:"ACTIVE_LAYER",
        id: null
      })
      activeDispatch({type:"EDITING_PIN",id:null})
    }
    //SEARCH IS OPEN, SET TO TOPMOST OF NEW LAYERSET
    if(editingPin === null && infoWindowState.infoWindowShown) {
      activeDispatch({
        type: "ACTIVE_LAYER",
        id: layerData[0].id
      })
    }
    //HOVERING PIN GOT DELETED 
    if(hoveringPin!=null&&!pinIds.includes(hoveringPin) ){
      activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})
    }
    //ONE OF THE SAVED PINS IS CURRENTLY OPEN and deleted
    if(editingPin !== null && !pinIds.includes(editingPin)) {
      activeDispatch({type:"EDITING_PIN",id:null});
      activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})
      infoWindowDispatch({type:"CLOSE_WINDOW"});
    }
  }
  const mapMover = useMapMover(); 
  const layerData = useLayerData();
  
  const moveToCenter = (value:string,layerData:TLayer[])=> {
    if(!layerData.length) return ; 
    
    mapMover("contain",layerData.map(l=>l.pins).flat());
    
  }

  return isMounted && <PortalContainer containerId="menu-container">
  
  <div className={`${styles.topMenu} `}>
    <UpdaterLive checkDeleted={checkDeleted} firstLoadFunction={moveToCenter}/>
    <Button
    icon={<RiMap2Line />}
    href={"/"}
    modifiers={["secondary","sm"]}
    >
    All maps
    </Button>

  </div>  
  </PortalContainer>
}
export default TopMenu

//menucontainer