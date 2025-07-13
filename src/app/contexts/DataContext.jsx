'use client'
import { useReducer, createContext, useState, useEffect} from "react";

import layerUpdater from "./layerUpdater";


const DataContext = createContext()

const DataContextProvider = ({children,serverId,user}) => {
  const localMapData = null;
  /*
  let localMapData = localStorage.getItem(localStore);
  if(localMapData) {
    localMapData = JSON.parse(localMapData);
  }

  localMapData = localMapData.all.find(m => m.id == serverId);
  */
  const initLayers =  localMapData? localMapData.layerData : [];

  const [pageTitle,updatePageTitle] = useReducer((oldTitle,newTitle) => {
    document.title = `${newTitle} - Map App`
    return newTitle; 
  }, localMapData?.title || "")
  const [mapId,updateMapId] = useReducer((oldId,newId) => {
    return newId
  },serverId)
  const [mapIcon,updateMapIcon] = useReducer((oldIcon,newIcon) => {
    document.title = `${newIcon}${document.title.replace(oldIcon,"")}`
    return newIcon
  },localMapData?.mapIcon)

  const [layerData, layerDispatch] = useReducer(layerUpdater, initLayers);
  return (
    <DataContext.Provider value={{user,mapIcon,updateMapIcon,mapId,updateMapId,pageTitle,updatePageTitle ,layerData, layerDispatch }}>
      {children}
    </DataContext.Provider>
  );
}
export default DataContext
export {DataContextProvider,DataContext}
