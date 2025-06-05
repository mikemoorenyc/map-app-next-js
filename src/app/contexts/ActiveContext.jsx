'use client'
import { useReducer, createContext} from "react";


import activeUpdater from "./activeUpdater";

const ActiveContext = createContext()

const ActiveContextProvider = ({children, mapData}) => {
    
  const initLayers = mapData?.layerData || [];
  const initActives = {
    editingLayer : null, 
    activeLayer : initLayers.length ?  initLayers[0]?.id : null,
    editingPin : null,
    pinRefs : [],
    collapsedLayers : [],
    layerPanelRef : null,
    pinItemsRef : [],
    hoveringPin: null,
    activeModal: [] 
  }
  
  const [activeData, activeDispatch] = useReducer(activeUpdater, initActives);
 
  return (
    <ActiveContext.Provider value={{ activeData,activeDispatch}}>
      {children}
    </ActiveContext.Provider>
  );
}
export default ActiveContext
export {ActiveContextProvider,ActiveContext}