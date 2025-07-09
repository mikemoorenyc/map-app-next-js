import { useState ,useEffect} from "react";

export default function ({appMap,width,height,className}) {
  
  
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
    const changeMode = (event) => {
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
   
    const markerString = appMap.layerData.reverse().map(l => {
      const color = l.color.replace("#","0x");
      
      return l.pins.map(p => {
        return `markers=size:tiny|color:${color}|${p.location.lat},${p.location.lng}`
      }).join("&");
    
    }).join("&");
    
  /*const markerString = pins.map(p => {
    return `${p.location.lat},${p.location.lng}`
  }).join("|")*/

  return <img className={className} 
  src={`https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&key=${apiKey}&map_id=${mapStyleId}&${markerString}`}
  
  />
  

}
