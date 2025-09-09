'use client'
import {Suspense, useContext ,useEffect,useState,lazy} from "react"
import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps"
import Pins from "./Pins"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import GeoLocation from "./GeoLocation"
import UpdaterLive from "../../desktop/TopMenu/UpdaterLive"
import DrawerPanel from "../DrawerPanel"
import DirectionServicer from "./DirectionServicer"
import { memo, useCallback } from "react"
import Prescence from "../../desktop/MapPanel/Prescence"
import { ClientSideSuspense } from "@liveblocks/react"
import { TLayer } from "@/projectTypes"


const MobileSearch = lazy(()=>import("./MobileSearch"));
const Legend = lazy(()=> import("../Legend"))

const MapMemo = memo(Map) 
const DrawerPanelMemo = memo(DrawerPanel);

const MapPanel = () => {
  const darkModeId = process.env.NEXT_PUBLIC_MAP_MOBILE_ID;
  const lightModeId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID;
  const apiKey =process.env.NEXT_PUBLIC_MAP_API_KEY;
  if(!apiKey||!darkModeId||!lightModeId) {
    throw new Error("missing env variables");
  }
  const {activeDispatch,activeData} = useContext(MobileActiveContext);
  
  

  const [mapStyleId,updateMapStyleId] = useState(darkModeId);

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
  const closeActive = useCallback((e:MapMouseEvent) => {
    activeDispatch({type: "SET_ACTIVE_PIN",id:null})
    activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    activeDispatch({type: "BACK_STATE",state:"base"})
    if(e.detail.placeId) {
            e.stop(); 
    }
  },[activeDispatch])
  console.log(activeData);
  const {activePin} = activeData; 
  const checkDeleted = (layerDataTemp:TLayer[],layerData:TLayer[]) => {

    const pinIds = layerDataTemp.map(l => l.pins).flat().map(p=>p.id);
    const layerIds = layerDataTemp.map(l=>l.id)
    const currentPin = layerData.map(l=>l.pins).flat().find((p) => p.id == activePin);
    if(activePin == "temp") return ; 
    //LAYER IN WHICH ACTIVE PIN IS A PART
    if(currentPin && !layerIds.includes(currentPin.layerId) ) {
      activeDispatch({
        type:"SET_ACTIVE_PIN",
        id: null
      })
      activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    
    }
    //ACTIVE PIN GOT DELETED
    if(currentPin && !pinIds.includes(currentPin.id)) {
      activeDispatch({
        type:"SET_ACTIVE_PIN",
        id: null
      })
      activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    }

  }
  return <div className="mobile-app" style={{position:"fixed", inset: 0, overflow:"hidden"}}><APIProvider version="beta" apiKey={apiKey}>
      <MapMemo
      onClick={closeActive}
      mapId={mapStyleId}
      defaultZoom={3}
    

      defaultCenter={{lat: 22.54992, lng: 0}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      style={{inset:0,position:"absolute"}}
      id={"mobile-map"}
    >
  <Pins  />
  <Suspense><MobileSearch/></Suspense>
  <div style={{position:"fixed",left:24,top:74}}> <UpdaterLive {...{checkDeleted}}firstLoadFunction={()=> {
    activeDispatch({
      type: "UPDATE_REMOTE_LOAD",
      value: true
    })
  }}/>    </div>
      <GeoLocation />
      <DirectionServicer />
         <Suspense><Legend /></Suspense>
         <DrawerPanelMemo />
         <ClientSideSuspense fallback={<></>}><Prescence {...{activeDispatch}} hideOnEditing={true} overrideStyles={{
          bottom: "auto",
          transformOrigin: "top right",
          top: 82,
          display:activeData?.legendOpen?"none":undefined
         }}/></ClientSideSuspense>
    </MapMemo>
    
   
  
  </APIProvider></div>
}
export default MapPanel
