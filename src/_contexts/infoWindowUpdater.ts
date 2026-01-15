import { ReactNode, RefObject } from "react"
import { TInfoWindowState } from "./InfoWindowContext"
import { TGeolocation } from "@/projectTypes"

export type TInfoWindowActions = |
  {type:"UPDATE_TEMP_REF",tempRef:RefObject<HTMLDivElement>}|
  {type:"UPDATE_TEMP_MARKER_POSITION",position:TGeolocation}|
  {type:"UPDATE_ANCHOR",anchor:RefObject<HTMLDivElement>}|
  {type:"UPDATE_CONTENT",newContent:{header:ReactNode,content:ReactNode}}|
  {type:"OPEN_WINDOW",callback:Function, position?:TGeolocation,anchor:RefObject<HTMLDivElement>,content:{header:ReactNode,body:ReactNode}}|
  {type:"CLOSE_WINDOW",callback:Function}


export default (infoState:TInfoWindowState, action:TInfoWindowActions) => {

    switch(action.type) {
      case "UPDATE_TEMP_REF" :{
        return {...infoState, ...{tempRef: action.tempRef}}
      }
      case "UPDATE_TEMP_MARKER_POSITION": {
        console.log(action)
        return {...infoState,...{tempMarkerPosition:action.position}}
      }
      case "UPDATE_ANCHOR": {
        return {...infoState, ...{anchor:action.anchor}}
      }
      case "UPDATE_CONTENT": {
        const newContent = {...infoState.infoWindowContent, ...action.newContent}
        return {...infoState, ...{infoWindowContent: newContent}}
      }
      case "OPEN_WINDOW": {
    
        if (action.callback) {
          action.callback(); 
        }
        return {...infoState,...{infoWindowShown: true,
        infoWindowPosition: action.position || null ,
          infoWindowAnchor: action.anchor || infoState.tempRef,
          infoWindowContent : action.content}}
      }
      
      case "CLOSE_WINDOW" : {
        if(action.callback) {
          action.callback()
        }
        return {...infoState,...{
          infoWindowShown:false, 
          infoWindowAnchor: null,
          tempMarkerPosition: null,
          infoWindowContent: {
            header:null,
            body:null
          }}
        }
      }
    }
  }