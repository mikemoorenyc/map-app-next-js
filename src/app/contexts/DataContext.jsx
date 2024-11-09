'use client'
import { useReducer, createContext} from "react";

import layerUpdater from "./layerUpdater";


const DataContext = createContext()

const DataContextProvider = ({children}) => {
    
  const initLayers =  [];

  const [pageTitle,updatePageTitle] = useReducer((oldTitle,newTitle) => {
    return newTitle; 
  }, "")

  const [layerData, layerDispatch] = useReducer(layerUpdater, initLayers);
  return (
    <DataContext.Provider value={{pageTitle,updatePageTitle ,layerData, layerDispatch }}>
      {children}
    </DataContext.Provider>
  );
}
export default DataContext
export {DataContextProvider,DataContext}