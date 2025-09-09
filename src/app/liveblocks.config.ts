import { TGeolocation, TLayer } from "@/projectTypes";

declare global {
  interface Liveblocks {
    // Presence type
    Presence: {
      name:string, 
      email:string, 
      color:string,
      isEditing:boolean,
      savePending?:boolean,
      geolocation?:TGeolocation
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
