import * as React from "react";

import { useContext,memo,useEffect } from "react";
import PinMarker from "./PinMarker";
import ActiveContext from "@/app/contexts/ActiveContext";
import { usePinIds, usePinsFlat } from "@/app/lib/useLayerData";

const PinMarkerMemo = memo(PinMarker)
const PinContainer = () => {
    
 
    
    const pinsFlat = usePinsFlat();
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

        return <PinMarkerMemo indexNum={i}  key={p.id } pId={p.id} />
    })}
    
    </>
}
export default PinContainer;