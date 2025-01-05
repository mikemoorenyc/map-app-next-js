'use client'
import { useReducer, createContext} from "react";

const MobileActiveContext = createContext()
const MobileActiveContextProvider = ({children,mapData}) => {
  const initActives = {
    disabledLayers : [],
    activePin : null,
    legendOpen : false,
    drawerState: "minimized",
    tempData: null,
    expandedLayers: [],
    backState: "base"
   
  }
  const activeUpdater = (actives,action) => {


    switch(action.type) {
      case "SET_ACTIVE_PIN" : {
        return {...actives, ...{activePin : action.id} }
      }
      case "SET_TEMP_DATA": {
        return {...actives, ...{tempData: action.data}}
      }
      case "REMOVE_DISABLED_LAYER" : {
        return {...actives, ...{disabledLayers : actives.disabledLayers.filter(l => l != action.id)}}
      }
      case "UPDATE_EXPANDED_LAYERS" : {
        let newLayers = [...actives.expandedLayers]
        if(action.state == "expanded") {
          newLayers = [...newLayers, ...[action.id]]
        }
        if(action.state == "collapsed") {
          newLayers = newLayers.filter(l => l != action.id);
        }
        return {...actives, ...{expandedLayers: newLayers}}
      }
      case "ADD_DISABLED_LAYER" : {
        
        
      
        return {...actives, ...{disabledLayers: [...actives.disabledLayers, ...[action.id]]}}
      }
      case "LEGEND_OPEN" : {
        console.log("legend open")
        return {...actives, ...{legendOpen: action.state}}
      }
      case "DRAWER_STATE" : {
        return {...actives, ...{drawerState: action.state}}
      }
      case "BACK_STATE" : {
        return {...actives, ...{backState: action.state}}
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