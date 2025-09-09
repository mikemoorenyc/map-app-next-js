'use client'
import { useReducer, createContext, ReactElement, RefObject} from "react";


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
type ActiveContextLiveData = {
  activeData: TActiveData,
  activeDispatch:Function
}
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

const ActiveContext = createContext<ActiveContextLiveData>({
  activeData:initActives,
  activeDispatch: ()=>{}
})

const ActiveContextProvider = ({children}:{children:ReactElement[]}) => {
    

 
  
  const [activeData, activeDispatch] = useReducer(activeUpdater, initActives);
 
  return (
    <ActiveContext.Provider value={{ activeData,activeDispatch}}>
      {children}
    </ActiveContext.Provider>
  );
}
export default ActiveContext
export {ActiveContextProvider,ActiveContext}