import { TLayer } from "@/projectTypes";

export default function (){
  if(!window) return {
    pageTitle:"",
    layerData:[]
  }
  const mapId = window.location.pathname.split("/")[2];
  if(!localStorage) return {
    pageTitle:"",
    layerData:[]
  }
  const data = localStorage.getItem(`map-${mapId}`);
  if(!data) {
    return {
      pageTitle:"",
      layerData:[]
    }
  }
  return JSON.parse(data) as {
    pageTitle:string,
    layerData:TLayer[],
    mapIcon?:string
  }
}