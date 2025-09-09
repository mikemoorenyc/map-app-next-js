import { Dispatch, useContext } from "react";
import DataContext from "../contexts/DataContext";
import {  useMyPresence } from "@liveblocks/react/suspense";
import { UserActions } from "../contexts/layerUpdater";

export default function useLiveEditing() {
  const [myPresence,updateMyPresence] = useMyPresence(); 
  const {layerDispatch,updatePageTitle,updateMapIcon} = useContext(DataContext);

  type DispatchActions = UserActions|{type:"UPDATE_TITLE";data:string}|{type:"UPDATE_MAP_ICON";data:string}

  

  return (dispatchEvent:DispatchActions) => {
    
    if(dispatchEvent.type == "UPDATE_TITLE") {
      updatePageTitle(dispatchEvent.data);
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
