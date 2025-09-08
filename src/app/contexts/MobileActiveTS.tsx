'use client'
import { useReducer, createContext} from "react";

type PinDetails = {
    title:string
}
type TGeolocation = {
    lat:number,
    lng:number
}
type TRoute = {
    text:string, 
    value:number
}
type DrawerStates = "minimized"|"maximized"|"open"|"editing"

type MobileActiveData = {
    disabledLayers: number[],
    activePin: null|string|number,
    legendOpen: boolean,
    drawerState:DrawerStates,
    tempData: PinDetails|null,
    expandedLayers:number[],
    backState:"base"|"legend",
    inBounds:boolean,
    geolocation:TGeolocation,
    colorMode:"light"|"dark",
    remoteLoad: boolean,
    canEdit:boolean,
    routes: null| {
        TRANSIT: TRoute
    }
}



const MobileActiveContext = createContext()
const MobileActiveContextProvider = ({children,mapData}) => {
  const initActives = {
    disabledLayers : [],
    activePin : null,
    legendOpen : false,
    drawerState: "minimized",
    tempData: null,
    expandedLayers: [],
    backState: "base",
    inBounds: false,
    geolocation: null,
    routes: null,
    remoteLoad: false,
    colorMode: "light",
    canEdit: true
  }
  type MobileActiveUserActions = |
    {type:"CAN_EDIT";canEdit:boolean}|
    {type:"UPDATE_REMOTE_LOAD";value:boolean}|
    {type:"UPDATE_COLOR_MODE";colorMode:"light"|"dark"}|
    {type:"UPDATE_GEOLOCATION";geolocation:TGeolocation}|
    {type:"SET_ROUTES"; reset?:boolean;updatedRoute?: {TRANSIT:TRoute}}|
    {type:"UPDATE_INBOUNDS";inBounds:boolean}|
    {type:"SET_ACTIVE_PIN",id:string|number}|
    {type:"SET_TEMP_DATA";data:PinDetails}|
    {type:"UPDATE_EXPANDED_LAYERS";id:number;state:"expanded"|"collapsed"}|
    {type:"UPDATE_DISABLED_LAYER";id:number;disabled:boolean}|
    {type:"LEGEND_OPEN";state:boolean}|
    {type:"DRAWER_STATE";state:DrawerStates}|
    {type:"BACK_STATE";state:"back"}

  const activeUpdater = (actives:MobileActiveData,action:MobileActiveUserActions) : MobileActiveData => {
    
    switch(action.type) {
      case "CAN_EDIT": {
        return {...actives,...{canEdit:action.canEdit}}
      }
      case "UPDATE_REMOTE_LOAD": {
        return {...actives,...{remoteLoad: action.value}}
      }
      case "UPDATE_COLOR_MODE": {
        return {...actives, ...{colorMode:action.colorMode}}
      }
      case "UPDATE_GEOLOCATION": {
        return {...actives, ...{geolocation: action.geolocation}}
      }
      case "SET_ROUTES": {
        if(action.reset == true) {
          return {...actives, ...{routes:null}};
        }
        const newRoutes = {...actives.routes, ...action.updatedRoute};
        return {...actives, ...{routes:newRoutes}}
      }
      case "UPDATE_INBOUNDS": {
        return {...actives, ...{inBounds: action.inBounds}}
      }
      case "SET_ACTIVE_PIN" : {
        return {...actives, ...{activePin : action.id} }
      }
      case "SET_TEMP_DATA": {
        return {...actives, ...{tempData: action.data}}
      }
      case "UPDATE_DISABLED_LAYER": {
        const {disabledLayers} = actives;
        return action.disabled? disabledLayers.filter(l=>l!=action.id):
            [...disabledLayers,...[action.id]];
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
