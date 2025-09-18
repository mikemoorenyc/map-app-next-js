'use client'
import { Dispatch, useContext } from "react";
import DataContext from "../contexts/DataContext";
import {  useMutation, useMyPresence, useStorage } from "@liveblocks/react/suspense";
import { UserActions } from "../contexts/layerUpdater";

export default function useLiveEditing() {
  const [myPresence,updateMyPresence] = useMyPresence(); 
  const {layerDispatch,updatePageTitle,updateMapIcon} = useContext(DataContext);


  type DispatchActions = UserActions|{type:"UPDATE_TITLE";data:string}|{type:"UPDATE_MAP_ICON";data:string}

  
 const simpleUpdater =  useMutation(

   // Mutation context is passed as the first argument
   
   ({ storage },toUpdate:{updater?:(i:string)=>void,key:"mapIcon"|"pageTitle"|"layerData",value:string}) => {
     // Mutate Storag

     storage.get("map").set(toUpdate.key,toUpdate.value)
     
   },
   []
 );
  return (dispatchEvent:DispatchActions) => {
    
    if(dispatchEvent.type == "UPDATE_TITLE") {
      simpleUpdater({key:"pageTitle",value:dispatchEvent.data});
      //updatePageTitle(dispatchEvent.data);
    }
    if(dispatchEvent.type == "UPDATE_MAP_ICON") {
      updateMapIcon(dispatchEvent.data);
    }
    if(dispatchEvent.type !== "UPDATE_MAP_ICON" && dispatchEvent.type !== "UPDATE_TITLE") {
      layerDispatch(dispatchEvent);
    }
    updateMyPresence({savePending: true});
  }
}
