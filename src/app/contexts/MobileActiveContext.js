'use client'
import { useReducer, createContext} from "react";

const MobileActiveContext = createContext()
const MobileActiveContextProvider = ({children,mapData}) => {
  const initActives = {
    activeLayers : mapData?.layerData ? mapData.layerData.map(e => e.id) : [],
    activePin : null,
    legendOpen : false,
    drawerState: "minimized",
    tempData: null
   
  }
  const activeUpdater = (actives,action) => {


    switch(action.type) {
      case "SET_ACTIVE_PIN" : {
        return {...actives, ...{activePin : action.id} }
      }
      case "SET_TEMP_DATA": {
        return {...actives, ...{tempData: action.data}}
      }
      case "REMOVE_ACTIVE_LAYER" : {
        return {...actives, ...{activeLayers : actives.activeLayers.filter(l => l != action.id)}}
      }
      case "ADD_ACTIVE_LAYER" : {
        
        
      
        return {...actives, ...{activeLayers: [...actives.activeLayers, ...[action.id]]}}
      }
      case "LEGEND_OPEN" : {
        console.log("legend open")
        return {...actives, ...{legendOpen: action.state}}
      }
      case "DRAWER_STATE" : {
        return {...actives, ...{drawerState: action.state}}
      }
    }
    throw Error('Unknown action: ' + action.type);

  }
  const [activeData, activeDispatch] = useReducer(activeUpdater, initActives);
  return (
    <MobileActiveContext.Provider value={{ activeData,activeDispatch}}>
      {children}
    </MobileActiveContext.Provider>
  );

}

export default MobileActiveContext
export {MobileActiveContextProvider,MobileActiveContext}