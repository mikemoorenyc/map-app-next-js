'use client'
import PortalContainer from "@/_components/PortalContainer/PortalContainer";
import UpdaterLive from "@/_components/UpdaterLive/UpdaterLive";
import { useCallback, useContext, useEffect,useState } from "react";
import styles from "./styles.module.css";
import ActiveContext from "@/_contexts/ActiveContext";
import Button from "@/_components/Button";
import { RiMap2Line } from "@remixicon/react";
import InfoWindowContext from "@/_contexts/InfoWindowContext";
import { TLayer } from "@/projectTypes";
import { useMap } from "@vis.gl/react-google-maps";
import { useLayers } from "@/_lib/dataHooks";
import useActiveStore from "@/_contexts/useActiveStore";
//import useLayerData from "@/_lib/useLayerData";


const MapContainer = ({containMap}:{containMap:Function}) => {
  const layers = useLayers(); 
  console.log(layers);
 
  useEffect(()=> {

    containMap("",layers)
  },[layers])
  return <></>
}

const TopMenu = () => {
  const {infoWindowState,infoWindowDispatch } = useContext(InfoWindowContext);
  const {activeDispatch} = useContext(ActiveContext)
 

  const editingLayer = useActiveStore(s=>s.editingLayer),
        activeLayer = useActiveStore(s=>s.activeLayer),
        editingPin = useActiveStore(s=>s.editingPin),
        hoveringPin = useActiveStore(s=>s.hovering);
  const [isMounted,updateIsMounted] = useState(false);
  const [serverLoaded,updateServerLoaded] = useState(false);
  const map = useMap(); 
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

  const containMap = useCallback((type:string,layerData:TLayer[])=> {
    console.log("fired");
    if(type == "server") {
      updateServerLoaded(true);
    }
    if(!map) return false; 

    const pinsFlat = layerData.map(l=>l.pins).flat();
    var bounds = new google.maps.LatLngBounds();
    pinsFlat.forEach(p => {
       bounds.extend(p.location);
      })
    map.fitBounds(bounds,0);
    if(!pinsFlat.length) {
      map.setZoom(14);
      map.setCenter({
        lat:40.728504,
        lng: -73.9573446
      })
    }
  

  },[map])


  if(!isMounted) return ; 
  
  

  return <PortalContainer containerId="menu-container">
   
  
  <div className={`${styles.topMenu} `}>
    {!serverLoaded && <MapContainer {...{containMap}} />}
    <UpdaterLive checkDeleted={checkDeleted} firstLoadFunction={containMap}/>
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