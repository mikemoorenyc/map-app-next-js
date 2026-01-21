'use client'
import {Suspense, useContext ,useEffect,useState,lazy} from "react"
import { APIProvider, Map, MapMouseEvent, useMapsLibrary } from "@vis.gl/react-google-maps"
import Pins from "./Pins"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import GeoLocation from "./GeoLocation"
import UpdaterLive from "@/app/components/UpdaterLive/UpdaterLive"
import DrawerPanel from "../DrawerPanel"
import DirectionServicer from "./DirectionServicer"
import { memo, useCallback } from "react"
import Prescence from "../../../../components/Prescence"
import { ClientSideSuspense } from "@liveblocks/react"
import { TLayer, TMap } from "@/projectTypes"
import DataContext from "@/app/contexts/DataContext"
import { useLayers, useStatic } from "@/app/lib/useLayerData"
import useActiveStore from "@/app/contexts/useActiveStore"
import { getMap } from "@/app/actions/maps"


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
  //const {activeDispatch,activeData} = useContext(MobileActiveContext);

  const layerData = useLayers(); 
  const [checkerData,updateCheckerData] = useState<TLayer[]|null>(null)
  useEffect(()=> {
    if(!layerData.length) return ; 
    updateCheckerData(layerData);
  },[layerData])

  const {nonEditing,layerDispatch,updateMapIcon,updatePageTitle} = useContext(DataContext);
  const mapServer = useContext(DataContext).mapId

  const firstLoad = async () => {
    const localS = localStorage.getItem(`map-${mapServer}`);
    if(localS) {
      const mapData:TMap = JSON.parse(localS);
      layerDispatch({type: "FULL_REFRESH",newData: mapData.layerData});
      updatePageTitle(mapData.title);
      if(mapData.mapIcon) {
        updateMapIcon(mapData.mapIcon)
      }
    }
    const map  = await getMap(mapServer);
    if(!map) return ;
    layerDispatch({type: "FULL_REFRESH",newData: map.layerData});
      updatePageTitle(map.title);
      if(map.mapIcon) {
        updateMapIcon(map.mapIcon)
      }
    updateFirstLoad("server");
    updateCheckerData(map.layerData);
  }

  useEffect(()=> {
    if(!nonEditing) return ; 
    firstLoad(); 
  },[])

  
  const updateActivePin = useActiveStore(s=>s.updateActivePin);
  const updateDrawerState = useActiveStore(s=>s.updateDrawerState);
  const updateBackState = useActiveStore(s=>s.updateBackState);
  const updateFirstLoad = useActiveStore(s=>s.updateFirstLoad)
  const updateCanEdit = useActiveStore(s=>s.updateCanEdit)



  
  const closeActive = (e:MapMouseEvent) => {
    updateActivePin(null);
    updateDrawerState("minimized");
    updateBackState("base");
    //activeDispatch({type: "SET_ACTIVE_PIN",id:null})
    //activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    //activeDispatch({type: "BACK_STATE",state:"base"})
    if(e.detail.placeId) {
            e.stop(); 
    }
  }

  //const {activePin,legendOpen} = activeData; 
  const activePin = useActiveStore(s=>s.activePin);
  const legendOpen = useActiveStore(s=>s.legendOpen);
  const checkDeleted = (layerDataTemp:TLayer[],layerData:TLayer[]) => {

    const pinIds = layerDataTemp.map(l => l.pins).flat().map(p=>p.id);
    const layerIds = layerDataTemp.map(l=>l.id)
    const currentPin = layerData.map(l=>l.pins).flat().find((p) => p.id == activePin);
    if(activePin == "temp") return ; 
    //LAYER IN WHICH ACTIVE PIN IS A PART
    if(currentPin && !layerIds.includes(currentPin.layerId) ) {
      updateActivePin(null)
      updateDrawerState("minimized");
      /*activeDispatch({
        type:"SET_ACTIVE_PIN",
        id: null
      })
      activeDispatch({type: "DRAWER_STATE", state: "minimized"});
      */
    }
    //ACTIVE PIN GOT DELETED
    if(currentPin && !pinIds.includes(currentPin.id)) {
      updateActivePin(null);
      updateDrawerState("minimized")
      /*
      activeDispatch({
        type:"SET_ACTIVE_PIN",
        id: null
      })
      activeDispatch({type: "DRAWER_STATE", state: "minimized"});
      */
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
  {!nonEditing&&<div style={{position:"fixed",left:24,top:74}}> <UpdaterLive {...{checkDeleted}}firstLoadFunction={(value:"local"|"server"|false,data:TLayer[])=> {
    /*activeDispatch({
      type: "UPDATE_FIRST_LOAD",
      value
    })*/
    updateFirstLoad(value);
    updateCheckerData(data);
  }}/>    </div>}
      <GeoLocation {...{checkerData}}/>
      <DirectionServicer />
         <Suspense><Legend /></Suspense>
         <DrawerPanelMemo />
         {!nonEditing && <ClientSideSuspense fallback={<></>}><Prescence 
            hideOnEditing={true}
            overrideStyles={{
          bottom: "auto",
          transformOrigin: "top right",
          top: 82,
          display:legendOpen?"none":undefined
         }}
         canEdit={updateCanEdit}
         
         
         /></ClientSideSuspense>}
         
    </MapMemo>
    
   
  
  </APIProvider></div>
}

export default MapPanel
/*
{!nonEditing&&<ClientSideSuspense fallback={<></>}><Prescence {...{activeDispatch}} hideOnEditing={true} overrideStyles={{
          bottom: "auto",
          transformOrigin: "top right",
          top: 82,
          display:activeData?.legendOpen?"none":undefined
         }}/></ClientSideSuspense>}
         */