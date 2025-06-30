'use client'
import { APIProvider , Map} from "@vis.gl/react-google-maps";
import { memo, useEffect, useState } from "react"
import { InfoWindowContextProvider } from "@/app/contexts/InfoWindowContext";

import PinEditWindow from "./PinEditWindow";
import DesktopSearch from "@/app/components/ModernSearch/DesktopSearch";
import PinContainer from "./PinContainer";
import ModernTempMarker from "@/app/components/ModernSearch/ModernTempMarker";

const MapMemo = memo(Map)
const DesktopSearchMemo = memo(DesktopSearch)

const MapPanel = () => {
  const [clickEvent,updateClickEvent] = useState(null);
  const [mapStyleId, updateMapStyleId] = useState(process.env.NEXT_PUBLIC_MAP_EDITOR_ID)
  useEffect(()=> {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      updateMapStyleId(process.env.NEXT_PUBLIC_MAP_MOBILE_ID)
    }
  },[])
  const mapClickHandler = (e) => {
    if(e.detail.placeId) {
            e.stop(); 
        }
        updateClickEvent(e);
        console.log("base click");
  }
  return <div
  style={{
    position:"fixed",
    left: 350,
    top: 0,
    right: 0,
    bottom: 0
  }}>
  <APIProvider apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY}>
  <InfoWindowContextProvider>
  <MapMemo 
    mapId={mapStyleId}
    onClick={mapClickHandler}
    style={{width: '100%', height: '100%',position:"absolute"}}
    defaultCenter={{lat: 40.7219697,lng:-73.9478447}}
    defaultZoom={13}
    disableDefaultUI={true}
  >
  <PinContainer/>
<DesktopSearchMemo clickEvent={clickEvent} />
  <PinEditWindow clickEvent={clickEvent} />
  <ModernTempMarker />
  </MapMemo>
  </InfoWindowContextProvider>
  
  </APIProvider>
  
  
  </div>
}

export default MapPanel

//  <SearchBar clickEvent={clickEvent} />