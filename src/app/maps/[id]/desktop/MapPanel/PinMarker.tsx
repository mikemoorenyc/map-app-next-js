import React, {useContext, useEffect, } from "react"
import {  AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import Pin from "../../sharedComponents/Pin";
import PinDisplay from "./PinEditWindow/PinDisplay";
import mapMover from "./lib/mapMover";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";


import useLayerData from "@/app/lib/useLayerData";

const PinMarker = ({pId, indexNum}:{pId:string|number,indexNum:number}) => {
    const layerD = useLayerData();  
    const {infoWindowDispatch} = useContext(InfoWindowContext);
    const {activeDispatch, activeData} = useContext(ActiveContext)

    const pin = layerD.findPin(pId);
    if(!pin) return ; 
    const layer = layerD.findLayer(pin.layerId);
    if(!layer) return false; 
    const {location} = pin;
    const {editingPin} = activeData;
    
    const handleClick = (e:google.maps.MapMouseEvent) => {
        if(editingPin === pin.id) return ; 
        activeDispatch({
            type: "EDITING_PIN",
            id:pin.id
        })
        activeDispatch({
            type:"ACTIVE_LAYER",
            id: layer.id
        })
    }
    const map = useMap(); 
    useEffect(()=> {
 
        if(!map) return ; 
        //DO NOTHING NOT THE RIGHT PIN
        if(editingPin !== pin.id) return ;
        //INFO WINDOW ALREADY OPEN
        
       // if(infoWindowState.infoWindowShown) return ;
        
        //IT IS OUR PIN AND IT"S NOT OPEN
        infoWindowDispatch({
            type: "OPEN_WINDOW",
            position: location,
            content: {
                    header: "",
                    body: <PinDisplay ></PinDisplay>
                }
            
            })
            mapMover(map,location);
           

    },[activeData.editingPin])
    
    let zindex = pin?.favorited ? 999 : 1; 
    const highlighted = layerD.isHighlighted(activeData,pin.id); 
    if(highlighted) {
        zindex=9999; 
    }
    
    
    return <AdvancedMarker onMouseEnter={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:pin.id})}}
    onMouseLeave={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})}} zIndex={zindex} onClick={handleClick}  position={location}>
    <Pin onMap={true}   highlighted={highlighted}  interactable={true} layer={layer}   pin={pin}  size={16} />
    </AdvancedMarker>
}
export default PinMarker