'use client'
import { TGeolocation, TPlaceDetails,TViewport } from "@/projectTypes";
import { useReducer, createContext, ReactNode} from "react";

export type TRoute = {
    text:string, 
    value:number
}
type DrawerStates = "minimized"|"maximized"|"open"|"editing"
export type TempData = TPlaceDetails & {location:TGeolocation,viewport:TViewport,id:string|number,description?:string;layerId?:null}
type TActiveData = {
  disabledLayers: number[],
  activePin:null|string|number, 
  legendOpen:boolean,
  drawerState:DrawerStates,
  tempData: null|TempData
  expandedLayers:number[],
  backState: "base"|"back"|"back_to_base"|"back_to_legend",
  inBounds:boolean,
  geolocation: null | TGeolocation,
  routes: null| {
        TRANSIT: TRoute
    },
  colorMode:"light"|"dark",
  canEdit:boolean,
  firstLoad:false|"local"|"server"
}
type MobileActiveUserActions = |
    {type:"CAN_EDIT";canEdit:boolean}|
    {type:"UPDATE_FIRST_LOAD";value:false|"local"|"server"}|
    {type:"UPDATE_COLOR_MODE";colorMode:"light"|"dark"}|
    {type:"UPDATE_GEOLOCATION";geolocation:TGeolocation}|
    {type:"SET_ROUTES"; reset?:boolean;updatedRoute?: {TRANSIT:TRoute}}|
    {type:"UPDATE_INBOUNDS";inBounds:boolean}|
    {type:"SET_ACTIVE_PIN",id:string|number}|
    {type:"SET_TEMP_DATA";data:TempData}|
    {type:"UPDATE_EXPANDED_LAYERS";id:number;state:"expanded"|"collapsed"}|
    {type:"UPDATE_DISABLED_LAYER";id:number;disabled:boolean}|
    {type:"LEGEND_OPEN";state:boolean}|
    {type:"DRAWER_STATE";state:DrawerStates}|
    {type:"BACK_STATE";state:"back"}


const initActives :TActiveData = {
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
    firstLoad:false,
    colorMode: "light",
    canEdit: true
  }

const MobileActiveContext = createContext<{activeData:TActiveData,activeDispatch:Function}>({activeData:initActives,activeDispatch:()=>{}})
const MobileActiveContextProvider = ({children}:{children:ReactNode}) => {
  
  const activeUpdater = (actives:TActiveData,action:MobileActiveUserActions) : TActiveData => {


    switch(action.type) {
      
      case "CAN_EDIT": {
        return {...actives,...{canEdit:action.canEdit}}
      }
      case "UPDATE_FIRST_LOAD": {
        return {...actives,...{firstLoad: action.value}}
      }
      case "UPDATE_COLOR_MODE": {
        return {...actives, ...{colorMode:action.colorMode}}
      }
      case "UPDATE_GEOLOCATION": {
        return {...actives, ...{geolocation: action.geolocation}}
      }
      case "SET_ROUTES": {
        if(action.reset == true||!action.updatedRoute) {
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
        const newDisabled = !action.disabled? disabledLayers.filter(l=>l!=action.id):
            [...disabledLayers,...[action.id]];
        return {...actives,...{disabledLayers:newDisabled}}
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