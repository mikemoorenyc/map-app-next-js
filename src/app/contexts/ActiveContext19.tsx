'use client'
import { useReducer, createContext, ReactElement, RefObject,useContext} from "react";


import activeUpdater from "./activeUpdater";

export type TActiveData = {
  editingLayer?: number|null,
  activeLayer?:number|null,
  editingPin:number|string|null,
  pinRefs: {ref:HTMLDivElement,id:string|number}[],
  collapsedLayers: number[],
  layerPanelRef: null|HTMLDivElement
  pinItemsRef:{ref:HTMLDivElement,id:string|number}[],
  hoveringPin:null|string|number,
  activeModal:string[],
  canEdit:boolean
}

const ActiveContext19 = createContext<any>(null);
export default function ({children}:{children:ReactElement[]})  {
  const initActives: TActiveData = {
    editingLayer : null, 
    activeLayer : null,
    editingPin : null,
    pinRefs : [],
    collapsedLayers : [],
    layerPanelRef : null,
    pinItemsRef : [],
    hoveringPin: null,
    activeModal: [] ,
    canEdit: true
  }
  const [activeData, activeDispatch] = useReducer(activeUpdater, initActives);
  

  return <ActiveContext19 value={{ activeData,activeDispatch}}>
    {children}
  </ActiveContext19>
}
/*
const ActiveContext = createContext({})

const ActiveContextProvider = ({children}:{children:ReactElement[]}) => {
    

  const initActives: TActiveData = {
    editingLayer : null, 
    activeLayer : null,
    editingPin : null,
    pinRefs : [],
    collapsedLayers : [],
    layerPanelRef : null,
    pinItemsRef : [],
    hoveringPin: null,
    activeModal: [] ,
    canEdit: true
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
*/