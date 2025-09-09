'use client'
import * as React from 'react';
import { RefObject } from 'react';
import { useReducer, createContext} from "react";
import infoWindowUpdater from './infoWindowUpdater';
import { TGeolocation } from '@/projectTypes';

export type TInfoWindowState = {
  infoWindowShown:boolean,
  infoWindowAnchor:RefObject<HTMLDivElement|null> | null,
  infoWindowContent: {
    header:React.ReactNode|null,
    body:React.ReactNode|null
  },
  tempRef:RefObject<HTMLDivElement|null>|null,
  tempMarkerPosition:TGeolocation|null,
  infoWindowPosition:TGeolocation|null
}
const initWindowState :TInfoWindowState = {
    infoWindowShown: false,
    infoWindowAnchor : null, 
    infoWindowPosition: null,
    infoWindowContent : {
      header: null,
      body: null
    },
    tempRef: null,
    tempMarkerPosition: null
  
  }

type TContext = {
  infoWindowState:TInfoWindowState,
  infoWindowDispatch: Function
}

const InfoWindowContext = createContext<TContext>({infoWindowState:initWindowState,infoWindowDispatch:()=>{}})

const InfoWindowContextProvider = ({children}:{children:React.ReactNode}) => {
    
  
  
  


  const [infoWindowState, infoWindowDispatch] = useReducer(infoWindowUpdater, initWindowState);
  return (
    <InfoWindowContext.Provider value={{infoWindowState,infoWindowDispatch}}>
      {children}
    </InfoWindowContext.Provider>
  );
}
export default InfoWindowContext
export {InfoWindowContextProvider,InfoWindowContext}