'use client'
import { useReducer, createContext, useState, useEffect, ReactElement} from "react";

import layerUpdater from "./layerUpdater";
import { TMap, TUser,TLayer } from "@/projectTypes";



type TDataContext = {
  layerData: TLayer[],
  mapIcon?:string, 
  pageTitle:string, 
  mapId:number, 
  user:TUser,
  updateMapIcon: (icon:string)=>void,
  updateMapId: (id:number)=>void,
  updatePageTitle: (title:string) => void,
  layerDispatch:Function
}


const DataContext = createContext<TDataContext>({
  layerData:[],
  pageTitle:"",
  mapId:12,
  user:{
    name:"",
    email:"",
  },
  updateMapIcon:(i)=>{},
  updateMapId:(i)=>{},
  updatePageTitle:(i)=>{},
  layerDispatch:()=>{}
})

const DataContextProvider = ({children,serverId,user}:{children:ReactElement,serverId:string,user:TUser}) => {

  /*
  let ls = localStorage.getItem(`map-${string}`) ;
  let initDm;
  if(ls&ls!== null) {
    initDM = JSON.parse(ls) as {layerData:TLayer[],mapIcon?:string,pageTitle:string}
  }
  if(
  
  if(localMapData) {
    localMapData = JSON.parse(localMapData);
  }

  localMapData = localMapData.all.find(m => m.id == serverId);
  */
  const initLayers : TLayer[] =  [];

  const [pageTitle,updatePageTitle] = useReducer((oldTitle:string,newTitle:string) => {
    /*if(oldTitle) {
      document.title = document.title.replace(oldTitle,newTitle);
    }*/
    
    return newTitle; 
  }, "")
  const [mapId,updateMapId] = useReducer((oldId:number,newId:number) => {
    return newId
  },parseInt(serverId))
  const [mapIcon,updateMapIcon] = useReducer((oldIcon:string|null,newIcon:string) => {
    /*document.title = `${newIcon}${oldIcon?document.title.replace(oldIcon,""):""}`*/
    return newIcon
  },"")

  const [layerData, layerDispatch] = useReducer(layerUpdater, initLayers);
  return (
    <DataContext.Provider value={{user,mapIcon,updateMapIcon,mapId,updateMapId,pageTitle,updatePageTitle ,layerData, layerDispatch }}>
      {children}
    </DataContext.Provider>
  );
}
export default DataContext
export {DataContextProvider,DataContext}
