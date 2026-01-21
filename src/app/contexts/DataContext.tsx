'use client'
import { Dispatch,SetStateAction,useReducer, createContext, useState, useEffect, ReactNode} from "react";

import layerUpdater from "./layerUpdater";
import { TMap, TUser,TLayer } from "@/projectTypes";



type TDataContext = {
  layerData: TLayer[],
  mapIcon?:string, 
  pageTitle:string, 
  mapId:number, 
  nonEditing?:boolean,
  updateNonEditing?:Dispatch<SetStateAction<boolean>>,
  updateMapIcon: (icon:string)=>void,
  updateMapId: (id:number)=>void,
  updatePageTitle: (title:string) => void,
  layerDispatch:Function
}


const DataContext = createContext<TDataContext>({
  layerData:[],

  pageTitle:"",
  mapId:12,
  updateMapIcon:(i)=>{},
  updateMapId:(i)=>{},
  updatePageTitle:(i)=>{},
  layerDispatch:()=>{},

})

const DataContextProvider = (props:{children:ReactNode,serverId:string,user?:TUser,map?:TMap,nonEditing?:boolean}) => {
  const {map,children,serverId} = props

  const initLayers : TLayer[] = map?.layerData||  [];

  const [pageTitle,updatePageTitle] = useReducer((oldTitle:string,newTitle:string) => {
    /*if(oldTitle) {
      document.title = document.title.replace(oldTitle,newTitle);
    }*/
    
    
    return newTitle; 
  }, map?.title||"")
  const [mapId,updateMapId] = useReducer((oldId:number,newId:number) => {
    return newId
  },parseInt(serverId))
  const [mapIcon,updateMapIcon] = useReducer((oldIcon:string|null,newIcon:string) => {
    /*document.title = `${newIcon}${oldIcon?document.title.replace(oldIcon,""):""}`*/
    
    return newIcon
  },map?.mapIcon||"")

  const [layerData, layerDispatch] = useReducer(layerUpdater, []);
  const [nonEditing,updateNonEditing] = useState(props.nonEditing||false)
  

  useEffect(()=> {
    if(!window) return ; 
    if(!localStorage) return ;
    const data = localStorage.getItem("map-"+window.location.pathname.split("/")[2]);
 
    if(!data) return ; 
    const ls = JSON.parse(data) as {
      layerData: TLayer[],
      pageTitle: string,
      mapIcon?: string
    }

    layerDispatch({
      type:"REFRESH_LAYERS",
      newLayers: ls.layerData
    })
    updatePageTitle(ls.pageTitle);
    if(ls.mapIcon) {
      updateMapIcon(ls.mapIcon);
    }
  },[])
  
  return (
    <DataContext.Provider value={{nonEditing:nonEditing||false,mapIcon,updateMapIcon,mapId,updateMapId,pageTitle,updatePageTitle ,layerData, layerDispatch,updateNonEditing }}>
      {children}
    </DataContext.Provider>
  );
}
export default DataContext
export {DataContextProvider,DataContext}
