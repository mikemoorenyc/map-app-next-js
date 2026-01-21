import React, {useCallback,useContext, useEffect, memo,useLayoutEffect} from "react"
import {  AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import Pin from "../../sharedComponents/Pin";
import PinDisplay from "./PinEditWindow/PinDisplay";
import mapMover from "./lib/mapMover";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";


import  { useFindLayer, useFindPin,isHighlighted } from "@/app/lib/useLayerData";
import { ClientSideSuspense } from "@liveblocks/react";



const PinDisplayMemo = memo(PinDisplay);
const PinMarker = ({pId, indexNum}:{pId:string|number,indexNum:number}) => {

    const {infoWindowDispatch} = useContext(InfoWindowContext)
    const {activeDispatch, activeData} = useContext(ActiveContext)
    const {collapsedLayers} = activeData
    
    const pin = useFindPin(pId)
    const layer = useFindLayer(pin?.layerId||-1)

   
    if(!pin || !layer) return ; 
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
        infoWindowDispatch({
            type: "OPEN_WINDOW",
            position: pin.location,
            content: {
                    header: "",
                    body: <PinDisplayMemo></PinDisplayMemo>
                }
            
            })
  
       
         mapMover(map,location);
           

    },[activeData.editingPin])
    
    let zindex = pin?.favorited ? 999 : 1; 
    const highlighted = isHighlighted(activeData,pin.id); 
    if(highlighted) {
        zindex=9999; 
    }
    if(collapsedLayers.includes(layer.id)) return ; 
    
    return (
        <ClientSideSuspense fallback={<></>}>


     <AdvancedMarker onMouseEnter={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:pin.id})}}
    onMouseLeave={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})}} zIndex={zindex} onClick={handleClick}  position={location}>
    <Pin onMap={true}   highlighted={highlighted}  interactable={true} layer={layer}   pin={pin}  size={16} />
    </AdvancedMarker>
   
    </ClientSideSuspense>
    
)
}
export default PinMarker