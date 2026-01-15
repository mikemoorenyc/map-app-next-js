"use client"
import useDarkMode from "@/_lib/useDarkMode";
import { THomepageMap } from "@/projectTypes";
import { useState ,useEffect} from "react";

type TMapThumbnailProps = {
  appMap: THomepageMap,
  width: number,
  height: number, 
  className: string,

}

export default function ({appMap,width,height,className}:TMapThumbnailProps) {
 
  
  

  const mapId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID;
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  let darkModeKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_DARKMODE;

  if(!mapId||!apiKey) return false; 

  if(!darkModeKey) {
    darkModeKey = mapId;
  }
  const darkMode = useDarkMode(); 

  let mode = (darkMode=="dark"||!darkMode) ? darkModeKey : mapId; 
    
    
  /*const markerString = pins.map(p => {
    return `${p.location.lat},${p.location.lng}`
  }).join("|")*/
  if(darkMode === null) {
    mode = mapId
  }


  return <img className={className} 
  src={`https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&key=${apiKey}&map_id=${mode}&${appMap.markerString}`}
  
  />
  

}
