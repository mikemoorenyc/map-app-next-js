'use client'
import { useReducer, createContext} from "react";


import activeUpdater from "./activeUpdater";

const ActiveContext = createContext()

const ActiveContextProvider = ({children}) => {
    

  const initActives = {
    editingLayer : null, 
    activeLayer : null,
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