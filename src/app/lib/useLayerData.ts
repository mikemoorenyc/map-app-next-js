'use client'

import { useCallback, useContext, useMemo,useEffect,useState } from "react";
import DataContext from "../contexts/DataContext";
import { TActiveData } from "../contexts/ActiveContext";
import { TLayer,TPin } from "@/projectTypes";
import { useStorage } from "@liveblocks/react";
import { shallow } from "@liveblocks/react";

const jsonCompare = (prev:Object|null|undefined,next:Object|null|undefined) =>JSON.stringify(prev) == JSON.stringify(next);

export const useStatic = () => {
    const {nonEditing} = useContext(DataContext);

    return !nonEditing; 
}
export const isHighlighted = (activeData:TActiveData, pinId:string|number) => {
  return activeData.editingPin == pinId || activeData.hoveringPin == pinId
}
function useSafeLiveStorage<T>(
  selector: (root: {
    map: {
        mapIcon?:string, 
        pageTitle:string, 
        layerData:TLayer[]
    }
  }) => T,
  compare?: (a: T|null, b: T|null) => boolean
): T | null {
  try {
    return useStorage<T>(selector, compare);
  } catch (e) {
    return null;
  }
}
export const useLayers = () => {
  const editing = useStatic();
  const live = useSafeLiveStorage(root => root.map.layerData,jsonCompare)||[];
  const data  = useContext(DataContext).layerData
 
  return editing ? live : data;

}
export const usePinIds = () => {
  const editing = useStatic();
  const live =  useSafeLiveStorage<(string|number)[]>(root=> root.map.layerData.flatMap((l:TLayer)=>l.pins).map((p:TPin)=>p.id),shallow)||[];
  const data = useContext(DataContext).layerData.flatMap(l=>l.pins).map(p=>p.id);
  return editing? live:data; 
}
export const usePinsFlat=() =>{
  const editing = useStatic();

  const live =useSafeLiveStorage<TPin[]>(root=>root.map.layerData.flatMap(l=>l.pins),jsonCompare)||[]
  const data = useContext(DataContext).layerData.flatMap(l=>l.pins)
  return editing ? live : data
  
}

export const useFindPin = (id:string|number) => {
  const editing = useStatic();
  
  const finder = (layers:TLayer[]) => layers.flatMap((l:TLayer)=> {
    return l.pins || []
  }).find(p => p.id == id);


  const live = useSafeLiveStorage(root => {
    return finder(root.map.layerData);
  },jsonCompare)
  const data = finder(useContext(DataContext).layerData);
  return editing? live:data;
}
export const useFindLayer = (id:number) => {
    const editing = useStatic(); 
  const finder = (layers:TLayer[]) => layers.find(l => l.id == id);
  const live = useSafeLiveStorage(root => finder(root.map.layerData),jsonCompare)
  const data = finder(useContext(DataContext).layerData)
  if(!live && !data) {
    return undefined;
  }
 
  return editing?live:data
}





export const usePageTitle = () => {
    const editing = useStatic(); 
    
    let live = useSafeLiveStorage(root => root.map.pageTitle);
    const data = useContext(DataContext).pageTitle

    if(live === null) {
      live = "";
    }
    if(!live && !data) {
      return "";
    }
    return editing?live:data
  
}
export const useMapIcon = () => {
    const editing = useStatic(); 
    let live = useSafeLiveStorage(root => root.map.mapIcon);
    if(live === null) {
      live = undefined;
    }
    const data = useContext(DataContext).mapIcon;
    
    if(!live&&!data) return undefined;
    return editing?live:data;

}
/*
export const useMapId=() => {
  return useDataStore(s=>s.mapId);
}*/