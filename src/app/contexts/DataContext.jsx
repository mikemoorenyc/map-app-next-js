'use client'
import { useReducer, createContext} from "react";

import layerUpdater from "./layerUpdater";


const DataContext = createContext()

const DataContextProvider = ({children,mapData}) => {
  
  const initLayers =  mapData?.layerData || [];

  const [pageTitle,updatePageTitle] = useReducer((oldTitle,newTitle) => {
    document.title = `${newTitle} - Map App`
    return newTitle; 
  }, mapData?.title)
  const [mapId,updateMapId] = useReducer((oldId,newId) => {
    return newId
  },mapData?.id)

  const [layerData, layerDispatch] = useReducer(layerUpdater, initLayers);
  return (
    <DataContext.Provider value={{mapId,updateMapId,pageTitle,updatePageTitle ,layerData, layerDispatch }}>
      {children}
    </DataContext.Provider>
  );
}
export default DataContext
export {DataContextProvider,DataContext}