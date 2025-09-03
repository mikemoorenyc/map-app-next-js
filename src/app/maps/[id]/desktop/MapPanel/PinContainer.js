import * as React from "react";

import { useContext } from "react";
import PinMarker from "./PinMarker";
import ActiveContext from "@/app/contexts/ActiveContext";
import useLayerData from "@/app/lib/useLayerData";

const PinContainer = () => {
 
    
    const {pinsFlat} = useLayerData(); 
    const {collapsedLayers} = useContext(ActiveContext).activeData; 

 

       
    if(!pinsFlat.length) {
        return ; 
    }
    
    
    
    //Set initial viewport
    
    
    
    //const pins = [{lat:0,lng:0},{lat:20,lng:20},{lat:30,lng:30}];
    //console.log(pins);
    //return ;
 
    return <>
    {pinsFlat.reverse().map((p,i) => {
        if(collapsedLayers.includes(p.layerId)) {
            return ; 
        }
      
        return <PinMarker indexNum={i}  key={p.id } pId={p.id} onMap={false}/>
    })}
    
    </>
}
export default PinContainer;
