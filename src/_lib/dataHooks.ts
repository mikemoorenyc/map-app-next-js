 'use client'


import { TActiveData } from "../_contexts/ActiveContext";
import { TLayer,TPin } from "@/projectTypes";
import { shallow, useStorage } from "@liveblocks/react";
import useActiveStore from "../_contexts/useActiveStore";
import { useDataStore } from "../_contexts/useDataStore";



const jsonCompare = (prev:Object|null|undefined,next:Object|null|undefined) =>JSON.stringify(prev) == JSON.stringify(next)


const useStatic = () => {

  return useActiveStore(set=>set.staticMode);
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

export const usePinIds = () => {
  const editing = useStatic();
  const live =  useSafeLiveStorage<(string|number)[]>(root=> root.map.layerData.flatMap((l:TLayer)=>l.pins).map((p:TPin)=>p.id),shallow)||[]
  const data = useDataStore(state => state.pinIds);
  if(!editing) return live||[];
  return data
}
export const useLayerIds = () => {
  const editing = useStatic();
  const flatten = (layers:TLayer[]) => layers.map(l=>l.id);
  const live = useSafeLiveStorage<number[]>(root => flatten(root.map.layerData),shallow)||[]
  const data = useDataStore(state => flatten(state.layerData))||[]
  return !editing ?live:data;
}
export const isHighlighted = ( pinId:string|number) => {
  const editingPin=useActiveStore(s=>s.editingPin);
  const hoveringPin=useActiveStore(s=>s.hovering);
  return editingPin == pinId || hoveringPin == pinId
}
export const usePinsFlat=() =>{
  const editing = useStatic();

  const live =useSafeLiveStorage<TPin[]>(root=>root.map.layerData.flatMap(l=>l.pins),jsonCompare)||[]
  const data = useDataStore(d=>d.pinsFlat);
  return !editing ? live : data
}

export const useLayers = () => {
  const editing = useStatic();
  const live = useSafeLiveStorage(root => root.map.layerData,jsonCompare)||[]
  const data = useDataStore(state=>state.layerData)||[]
  return !editing ? live : data;
}

export const useFindLayer = (id:number) => {
    const editing = useStatic(); 
  const finder = (layers:TLayer[]) => layers.find(l => l.id == id);
  const live = useSafeLiveStorage(root => finder(root.map.layerData),jsonCompare)
  const data = useDataStore(state => finder(state.layerData))
  if(!live && !data) {
    throw new Error("can't find layer");
  }
  return !editing?live:data
}

export const useFindPin = (id:string|number) => {
  const editing = useStatic();
  
  const finder = (layers:TLayer[]) => layers.flatMap((l:TLayer)=> {
    return l.pins || []
  }).find(p => p.id == id);


  const live = useSafeLiveStorage(root => {
    return finder(root.map.layerData);
  },jsonCompare)
  const data = useDataStore(state =>finder(state.layerData));
  if(!live && !data) {
    throw new Error("can't find pin");
  }
  return !editing ? live : data
}

export const usePageTitle = () => {
    const editing = useStatic(); 
    
    const live = useSafeLiveStorage(root => root.map.pageTitle);
    const data = useDataStore(state =>state.title);
    if(!live && !data) {
      throw new Error("NO PAGE TITLE")
    }
    return !editing?live:data
}
export const useMapIcon = () => {
    const editing = useStatic(); 
    const live = useSafeLiveStorage(root => root.map.mapIcon);
    const data = useDataStore(state => state.mapIcon);
    
    if(!live&&!data) return undefined;
    return !editing?live:data;
}
export const useMapId=() => {
  return useDataStore(s=>s.mapId);
}