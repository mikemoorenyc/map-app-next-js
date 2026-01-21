'use client'
import { APIProvider , Map, MapMouseEvent} from "@vis.gl/react-google-maps";
import { memo, useEffect, useState ,useContext} from "react"
import { InfoWindowContextProvider } from "@/app/contexts/InfoWindowContext";
import TopMenu from "../TopMenu";
import PinEditWindow from "./PinEditWindow";
import DesktopSearch from "@/app/components/ModernSearch/DesktopSearch";
import PinContainer from "./PinContainer";
import ModernTempMarker from "@/app/components/ModernSearch/ModernTempMarker";
import Prescence from "../../../../components/Prescence";
import { ClientSideSuspense } from "@liveblocks/react";
import ActiveContext from "@/app/contexts/ActiveContext";

const MapMemo = memo(Map)
const DesktopSearchMemo = memo(DesktopSearch)
const TopMenuMemo = memo(TopMenu)
const PinContainerMemo = memo(PinContainer);

const MapPanel = () => {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID

  if(!apiKey||!mapId) return false; 
  const {activeDispatch} = useContext(ActiveContext)
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
  <PinContainerMemo/>
<DesktopSearchMemo clickEvent={clickEvent} />
  <PinEditWindow clickEvent={clickEvent} />
  <ModernTempMarker />
  <TopMenuMemo />
  </MapMemo>
  <ClientSideSuspense fallback={<></>}><Prescence  openDirection="bottom" canEdit={(t:boolean)=> {
    activeDispatch({
    type: "CAN_EDIT",
      canEdit: t
    })
  }} /></ClientSideSuspense>
  </InfoWindowContextProvider>
  
  </APIProvider>
  
  
  </div>
}

export default MapPanel

//  <SearchBar clickEvent={clickEvent} />