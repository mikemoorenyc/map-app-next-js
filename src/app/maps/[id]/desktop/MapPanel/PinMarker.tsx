import React, {useContext, useEffect, } from "react"
import {  AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import Pin from "../../../../../_components/Pin";
import PinDisplay from "./PinEditWindow/PinDisplay/PinDisplay";
import mapMover from "./lib/mapMover";
import InfoWindowContext from "@/_contexts/InfoWindowContext";
import ActiveContext from "@/_contexts/ActiveContext";
import { TCustomPayload } from "@/projectTypes";

import useLayerData from "@/_lib/useLayerData";
import { isHighlighted, useFindLayer, useFindPin } from "@/_lib/dataHooks";
import useActiveStore from "@/_contexts/useActiveStore";


const PinMarker = ({pId, indexNum}:{pId:string|number,indexNum:number}) => {
  
    const {infoWindowDispatch} = useContext(InfoWindowContext);
    const {activeDispatch,} = useContext(ActiveContext)
    const editingPin = useActiveStore(s=>s.editingPin)
    const updateEditingPin = useActiveStore(s=>s.updateEditingPin);
    const updateActiveLayer = useActiveStore(s=>s.updateActiveLayer);
    const updateHoveringPin = useActiveStore(s=>s.updateHovering)

    const pin = useFindPin(pId);
    const layer = useFindLayer(pin?.layerId||0);
    const collapsedLayers = useActiveStore(s=>s.collapsedLayers);
    const map = useMap(); 
    if(!layer) {
        throw new Error("no layer");
    }
    

   
    
    const handleClick = (e:google.maps.MapMouseEvent) => {
        if(editingPin === pin?.id||!pin||!layer) return ;    
        updateEditingPin(pin.id);  
        updateActiveLayer(layer.id);
        const event = new CustomEvent<TCustomPayload>("pinClicked", {
            detail: {
                id:pin.id
            }
        })
        window.dispatchEvent(event);
    }
    
    useEffect(()=> {
 
        if(!map||!pin) return ; 
        //DO NOTHING NOT THE RIGHT PIN
   
        if(editingPin !== pin?.id) return ;
        //INFO WINDOW ALREADY OPEN
        console.log("open");
        
       // if(infoWindowState.infoWindowShown) return ;
        
        //IT IS OUR PIN AND IT"S NOT OPEN
        infoWindowDispatch({
            type: "OPEN_WINDOW",
            position: pin.location,
            content: {
                    header: "",
                    body: <PinDisplay ></PinDisplay>
                }
            
            })
            mapMover(map,pin.location);
           

    },[editingPin])
    
    let zindex = pin?.favorited ? 999 : 1; 
    const highlighted = isHighlighted(pin?.id||1); 
    if(highlighted) {
        zindex=9999; 
    }
    if(!pin) return ; 
    if(!layer) return false; 
    if(collapsedLayers.includes(layer.id)) return ; 
    
    return <AdvancedMarker onMouseEnter={()=>{
        activeDispatch({type:"UPDATE_HOVERING_PIN",id:pin.id})
        updateHoveringPin(pin.id)
    }}
    onMouseLeave={()=>{
        activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})
        updateHoveringPin(null)
    }} zIndex={zindex} onClick={handleClick}  position={pin.location}>
    <Pin onMap={true}   highlighted={highlighted}  interactable={true} layer={layer}   pin={pin}  size={16} />
    </AdvancedMarker>
}
export default PinMarker