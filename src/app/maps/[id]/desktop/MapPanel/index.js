'use client'
import { APIProvider , Map} from "@vis.gl/react-google-maps";
import { useState } from "react"
import { InfoWindowContextProvider } from "@/app/contexts/InfoWindowContext";

import PinEditWindow from "./PinEditWindow";
import SearchBar from "./SearchBar";
import PinContainer from "./PinContainer";

const MapPanel = () => {
  const [clickEvent,updateClickEvent] = useState(null);
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
  <Map 
    mapId={process.env.NEXT_PUBLIC_MAP_EDITOR_ID}
    onClick={mapClickHandler}
    style={{width: '100%', height: '100%',position:"absolute"}}
    defaultCenter={{lat: 0, lng:0}}
    defaultZoom={3}
    disableDefaultUI={true}
  >
  <PinContainer/>
  <SearchBar clickEvent={clickEvent} />
  <PinEditWindow clickEvent={clickEvent} />
  </Map>
  </InfoWindowContextProvider>

  </APIProvider>
  
  
  </div>
}

export default MapPanel