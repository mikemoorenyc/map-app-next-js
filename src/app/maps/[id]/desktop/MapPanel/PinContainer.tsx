import * as React from "react";

import { useContext } from "react";
import PinMarker from "./PinMarker";
import ActiveContext from "@/_contexts/ActiveContext";
import useLayerData from "@/_lib/useLayerData";
import useActiveStore from "@/_contexts/useActiveStore";
import { usePinIds } from "@/_lib/dataHooks";


const PinContainer = () => {
 
    
 
    const pinsFlat = usePinIds(); 

 

       
    if(!pinsFlat.length) {
        return ; 
    }
   
    
    
    //Set initial viewport
    
    
    
    //const pins = [{lat:0,lng:0},{lat:20,lng:20},{lat:30,lng:30}];
    //console.log(pins);
    //return ;
 
    return <>
    {pinsFlat.reverse().map((p,i) => {
   
      
        return <PinMarker indexNum={i}  key={p } pId={p} />
    })}
    
    </>
}
export default PinContainer;