'use client'
import {Suspense, useContext ,useEffect,useState,lazy} from "react"
import { APIProvider, Map, MapMouseEvent, useMapsLibrary } from "@vis.gl/react-google-maps"
import Pins from "./Pins"
import MobileActiveContext from "@/_contexts/MobileActiveContext"
import GeoLocation from "./GeoLocation"
import UpdaterLive from "@/_components/UpdaterLive/UpdaterLive"
import DrawerPanel from "../DrawerPanel"
import DirectionServicer from "./DirectionServicer"
import { memo, useCallback } from "react"
import Prescence from "@/_components/Prescence"
import { ClientSideSuspense } from "@liveblocks/react"
import { TLayer } from "@/projectTypes"
import DataContext from "@/_contexts/DataContext"


const MobileSearch = lazy(()=>import("./MobileSearch"));
const Legend = lazy(()=> import("../Legend"))



const MapMemo = memo(Map) 
const DrawerPanelMemo = memo(DrawerPanel);

const MapPanel = () => {

  const mapId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID;
  
  const apiKey =process.env.NEXT_PUBLIC_MAP_API_KEY;
  if(!apiKey) {
    throw new Error("missing env variables");
  }
  const {activeDispatch,activeData} = useContext(MobileActiveContext);
  const {layerData} = useContext(DataContext);
  const [checkerData,updateCheckerData] = useState<TLayer[]|null>(null)
  useEffect(()=> {
    if(!layerData.length) return ; 
    updateCheckerData(layerData);
  },[layerData])

  
  

  
  const closeActive = useCallback((e:MapMouseEvent) => {
    activeDispatch({type: "SET_ACTIVE_PIN",id:null})
    activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    activeDispatch({type: "BACK_STATE",state:"base"})
    if(e.detail.placeId) {
            e.stop(); 
    }
  },[activeDispatch])

  const {activePin,legendOpen} = activeData; 
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
      mapId={mapId}
      defaultZoom={3}
      colorScheme="FOLLOW_SYSTEM"
      
    
      
      defaultCenter={{lat: 22.54992, lng: 0}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      style={{inset:0,position:"absolute"}}
      id={"mobile-map"}
    >
 {!legendOpen && <> <Pins  />
  <Suspense><MobileSearch/></Suspense> </>}
  <div style={{position:"fixed",left:24,top:74}}> <UpdaterLive {...{checkDeleted}}firstLoadFunction={(value:"local"|"server"|false,data:TLayer[])=> {
    activeDispatch({
      type: "UPDATE_FIRST_LOAD",
      value
    })
    updateCheckerData(data);
  }}/>    </div>
      <GeoLocation {...{checkerData}}/>
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
