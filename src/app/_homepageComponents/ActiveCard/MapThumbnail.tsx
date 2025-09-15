import { THomepageMap } from "@/projectTypes";
import { useState ,useEffect} from "react";

type TMapThumbnailProps = {
  appMap: THomepageMap,
  width: number,
  height: number, 
  className: string,
  darkMode: "light"|"dark"|null
}

export default function ({appMap,width,height,className,darkMode}:TMapThumbnailProps) {
 
  
  

  const mapId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID;
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  let darkModeKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_DARKMODE;

  if(!mapId||!apiKey) return false; 

  if(!darkModeKey) {
    darkModeKey = mapId;
  }

  const mode = (darkMode=="dark"||!darkMode) ? darkModeKey : mapId; 
    
    
  /*const markerString = pins.map(p => {
    return `${p.location.lat},${p.location.lng}`
  }).join("|")*/

  console.log(mode);
  return <img className={className} 
  src={`https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&key=${apiKey}&map_id=${mode}&${appMap.markerString}`}
  
  />
  

}
