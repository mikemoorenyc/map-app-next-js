import { THomepageMap } from "@/projectTypes";
import { useState ,useEffect} from "react";

type TMapThumbnailProps = {
  appMap: THomepageMap,
  width: number,
  height: number, 
  className: string
}

export default function ({appMap,width,height,className}:TMapThumbnailProps) {
 
  
  
  const darkModeId = process.env.NEXT_PUBLIC_MAP_MOBILE_ID;
  const lightModeId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID;
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY
  const [mapStyleId, updateMapStyleId] = useState(darkModeId);


  
  useEffect(()=> {

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    updateMapStyleId(darkModeId);
    } else {
      updateMapStyleId(lightModeId);
    }
    const changeMode = (event:MediaQueryListEvent) => {
      if(event.matches) {
        updateMapStyleId(darkModeId);
      } else {
        updateMapStyleId(lightModeId);
      }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeMode);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', changeMode);
    }

    },[])
    
    
  /*const markerString = pins.map(p => {
    return `${p.location.lat},${p.location.lng}`
  }).join("|")*/
  if(!mapStyleId) return ; 

  return <img className={className} 
  src={`https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&key=${apiKey}&map_id=${mapStyleId}&${appMap.markerString}`}
  
  />
  

}
