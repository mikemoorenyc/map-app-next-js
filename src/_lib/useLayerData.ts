'use client'

import { useCallback, useContext, useMemo,useEffect,useState } from "react";
import DataContext from "../_contexts/DataContext";
import { TActiveData } from "../_contexts/ActiveContext";
import { TLayer,TPin } from "@/projectTypes";
import { useStorage } from "@liveblocks/react";

export default function useLayerData() {
  let {layerData,pageTitle,mapIcon} = useContext(DataContext);
  const storageLayerData = useStorage(root => root.map.layerData);
  const storagePageTitle = useStorage(root => root.map.pageTitle);
  const storageMapIcon = useStorage(root=>root.map.mapIcon);
  layerData = storageLayerData||layerData;
  pageTitle = storagePageTitle||pageTitle;
  mapIcon = storageMapIcon||mapIcon;
  






const isHighlighted = useCallback((activeData:TActiveData, pinId:string|number) => {
  return activeData.editingPin == pinId || activeData.hoveringPin == pinId
},[])
const pinIds = useMemo(()=> {
 return layerData.map(l => l.pins).flat().map(p=>p.id);
},[layerData])
const layerIds = useMemo(()=> layerData.map(l=>l.id),[layerData]);
const pinsFlat = useMemo(()=>layerData.flatMap(l => l.pins),[layerData])
const layers = useMemo(()=>layerData,[layerData]);

const findLayer = useCallback((id:number):TLayer => {

  const theLayer = layerData.find(l => l.id == id);
  if(!theLayer) {
    throw new Error("Can't find layer"+id);
  }
  return theLayer; 
},[layerData])

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



  return useMemo(()=>{
    return {
    findPin,findLayer,isHighlighted,pinIds,layerIds,pinsFlat,layers,pageTitle,mapIcon
  }
  },[findPin,findLayer,isHighlighted,pinIds,pinsFlat,layerIds,layerData,pageTitle,mapIcon])

}