import { useCallback, useContext, useMemo } from "react";
import DataContext from "../contexts/DataContext";
import { TActiveData } from "../contexts/ActiveContext";
import { TLayer,TPin } from "@/projectTypes";

export default function useLayerData() {

  const {layerData} = useContext(DataContext); 

const findPin = useCallback((id:string|number):TPin => {

  const thePin = layerData.map(l=> {
    if (l?.pins) {
      return l.pins
    } else {
      return [];
    }
    }).flat().find(p => p.id == id)
  if(!thePin) {
    throw new Error("Can't find pin"+id);
  }
  return thePin; 
},[layerData])


const findLayer = useCallback((id:number):TLayer => {
  const theLayer = layerData.find(l => l.id == id);
  if(!theLayer) {
    throw new Error("Can't find layer"+id);
  }
  return theLayer; 
},[layerData])

const isHighlighted = (activeData:TActiveData, pinId:string|number) => {
  return activeData.editingPin == pinId || activeData.hoveringPin == pinId
}
const pinIds = useMemo(()=> {
 return layerData.map(l => l.pins).flat().map(p=>p.id);
},[layerData])
const layerIds = useMemo(()=> layerData.map(l=>l.id),[layerData]);
const pinsFlat = useMemo(()=>layerData.map(l=>l.pins).flat(),[layerData])
const layers = layerData



  return {
    findPin,findLayer,isHighlighted,pinIds,layerIds,pinsFlat,layers
  }

}