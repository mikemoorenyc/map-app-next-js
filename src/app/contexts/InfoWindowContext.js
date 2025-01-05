'use client'
import * as React from 'react';

import { useReducer, createContext} from "react";
import infoWindowUpdater from './infoWindowUpdater';

const InfoWindowContext = createContext()

const InfoWindowContextProvider = ({children}) => {
    
  
  const initWindowState = {
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
  


  const [infoWindowState, infoWindowDispatch] = useReducer(infoWindowUpdater, initWindowState);
  return (
    <InfoWindowContext.Provider value={{infoWindowState,infoWindowDispatch}}>
      {children}
    </InfoWindowContext.Provider>
  );
}
export default InfoWindowContext
export {InfoWindowContextProvider,InfoWindowContext}