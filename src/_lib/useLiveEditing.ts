'use client'


import {  useMutation, useMyPresence, useStorage } from "@liveblocks/react/suspense";
import { UserActions } from "../_contexts/layerUpdater";
import layerUpdater from "../_contexts/layerUpdater";
import { TLayer } from "@/projectTypes";

export type DispatchActions = UserActions|{type:"UPDATE_TITLE";data:string}|{type:"UPDATE_MAP_ICON";data:string}

export default function () {
  return useMutation(({ storage }, actions: DispatchActions[]) => {
    console.log(actions);
  const map = storage.get("map");
  let currentLayerData = map.get("layerData") as TLayer[];

  actions.forEach(action => {
    if (action.type === "UPDATE_TITLE") {
      map.set("pageTitle", action.data);
    } else if (action.type === "UPDATE_MAP_ICON") {
      map.set("mapIcon", action.data);
    } else {
      currentLayerData = layerUpdater(currentLayerData, action);
      console.log(currentLayerData);
    }
  });

  map.set("layerData", currentLayerData);
}, [])
}


