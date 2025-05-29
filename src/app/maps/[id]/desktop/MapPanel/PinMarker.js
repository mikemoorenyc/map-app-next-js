import React, {useContext, useEffect, useMemo, useState} from "react"
import {  AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import Pin from "../../sharedComponents/Pin";
import PinDisplay from "./PinEditWindow/PinDisplay";
import mapMover from "./lib/mapMover";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import DataContext from "@/app/contexts/DataContext";
import { findLayer, findPin, isHighlighted } from "./lib/finders";

const PinMarker = ({pId, onMap}) => {
    const {infoWindowDispatch} = useContext(InfoWindowContext);
    const {activeDispatch, activeData} = useContext(ActiveContext)
    const {layerData} = useContext(DataContext);
    const pin = findPin(layerData,pId);
    if(!pin) return ; 
    const layer = findLayer(layerData, pin.layerId);
    const {location,viewport} = pin;
    const {editingPin} = activeData;
    
    const handleClick = (e) => {
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
            mapMover(map,location,viewport);
           

    },[activeData.editingPin])
    
    
    const highlighted = isHighlighted(activeData,pin.id); 
    
    return <AdvancedMarker {...((highlighted || pin?.favorited )? {zIndex:9999} : {})}  onClick={handleClick}  position={location}>
    <Pin  windowOpen={true} highlighted={highlighted}  interactable={true} layer={layer}   pin={pin}  size={16} />
    </AdvancedMarker>
}
export default PinMarker