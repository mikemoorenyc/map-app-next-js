import { TGeolocation, TLayer } from "@/projectTypes";
import { LiveObject } from "@liveblocks/client";

declare global {
  interface Liveblocks {
    // Presence type
    Storage: {
      map: LiveObject<{
        pageTitle:string,
        mapIcon?:string,
        layerData:TLayer[]
      }>
    }

 
    Presence: {
      name:string, 
      email:string, 
      color:string,
      isEditing:boolean,
      savePending?:boolean,
      geolocation?:TGeolocation,
      savingDuties:boolean,
      isVisible:boolean
    };
    RoomEvent: {
      type: "UPDATE_DATA",
      data: {
        pageTitle:string,
        mapIcon?:string,
        layerData:TLayer[]
      }
    }
  }
}

export {};
