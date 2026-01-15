'use client'
import { APIProvider , Map, MapMouseEvent} from "@vis.gl/react-google-maps";
import { memo, useEffect, useState ,useContext, useMemo} from "react"
import { InfoWindowContextProvider } from "@/_contexts/InfoWindowContext";
import TopMenu from "../TopMenu";
import PinEditWindow from "./PinEditWindow";
import DesktopSearch from "@/_components/ModernSearch/DesktopSearch";
import PinContainer from "./PinContainer";
import ModernTempMarker from "@/_components/ModernSearch/ModernTempMarker";
import Prescence from "@/_components/Prescence";
import { ClientSideSuspense } from "@liveblocks/react";
import useActiveStore from "@/_contexts/useActiveStore";



const MapMemo = memo(Map)
const DesktopSearchMemo = memo(DesktopSearch)
const TopMenuMemo = memo(TopMenu)
const PinEditWindowMemo = memo(PinEditWindow)


const MapPanel = () => {

  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID
  const updateCanEdit = useActiveStore(s => s.updateCanEdit)
  if(!apiKey||!mapId) return false; 

  const [clickEvent,updateClickEvent] = useState<MapMouseEvent|null>(null);
  
  
  const mapClickHandler = (e:MapMouseEvent) => {
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
  <APIProvider {...{apiKey}}>
  <InfoWindowContextProvider>
  <MapMemo 
    mapId={mapId}
    onClick={mapClickHandler}
    style={{width: '100%', height: '100%',position:"absolute"}}
    defaultCenter={{lat: 40.7219697,lng:-73.9478447}}
    defaultZoom={13}
    disableDefaultUI={true}
    colorScheme="FOLLOW_SYSTEM"
  >
  <PinContainer/>

<DesktopSearchMemo clickEvent={clickEvent} />
  <PinEditWindowMemo clickEvent={clickEvent} />
  <ModernTempMarker />
  <TopMenuMemo />
  </MapMemo>
  <ClientSideSuspense fallback={<></>}><Prescence {...{
   updateCanEdit
  }} openDirection="bottom" /></ClientSideSuspense>
  </InfoWindowContextProvider>
  
  </APIProvider>
  
  
  </div>
}
const MapPanelMemo = memo(MapPanel);
export default MapPanelMemo;

//  <SearchBar clickEvent={clickEvent} />