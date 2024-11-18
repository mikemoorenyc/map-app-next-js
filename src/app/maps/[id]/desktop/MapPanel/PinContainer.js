import * as React from "react";
import {  useMap } from "@vis.gl/react-google-maps";

import DataContext from "@/app/contexts/DataContext";
import { useContext, useEffect, useState } from "react";
import PinMarker from "./PinMarker";
import ActiveContext from "@/app/contexts/ActiveContext";

const PinContainer = () => {
 
    
    const {layerData} = useContext(DataContext);
    const {collapsedLayers} = useContext(ActiveContext).activeData; 
    
    const pinsFlat = layerData.map(l => l.pins).flat()      
    const map = useMap(); 
    
    const [initialPinsAdded,updateInitialPinsAdded] = useState(false)
    //Set initial viewport
    useEffect(()=> {
        if (!map || !layerData.length || initialPinsAdded) return ;
        var bounds = new google.maps.LatLngBounds();
        updateInitialPinsAdded(true);
        pinsFlat.forEach(p => {
          bounds.extend(p.location)
        })
        map.fitBounds(bounds);


    },[map,layerData ])
    
    
    //const pins = [{lat:0,lng:0},{lat:20,lng:20},{lat:30,lng:30}];
    //console.log(pins);
    //return ;
    return <>
    {pinsFlat.map((p,i) => {
        if(collapsedLayers.includes(p.layerId)) {
            return ; 
        }
      
        return <PinMarker  key={p.id } pId={p.id}/>
    })}
    
    </>
}
export default PinContainer;