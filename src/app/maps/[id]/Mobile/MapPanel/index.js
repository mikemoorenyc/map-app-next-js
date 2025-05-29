'use client'
import { useContext ,useEffect,useState} from "react"
import { APIProvider, Map } from "@vis.gl/react-google-maps"
import Pins from "./Pins"
import MobileSearch from "./MobileSearch"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import Legend from "../Legend"
import GeoLocation from "./GeoLocation"
import Updater from "../../desktop/TopMenu/Updater"
import styles from "../"
import DirectionServicer from "./DirectionServicer"

const MapPanel = () => {
  const darkModeId = process.env.NEXT_PUBLIC_MAP_MOBILE_ID;
  const lightModeId = process.env.NEXT_PUBLIC_MAP_EDITOR_ID;
  const {activeDispatch} = useContext(MobileActiveContext)
  const [mapStyleId,updateMapStyleId] = useState(darkModeId);

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
  const closeActive = (e) => {
    activeDispatch({type: "SET_ACTIVE_PIN",id:null})
    activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    activeDispatch({type: "BACK_STATE",state:"base"})
    if(e.detail.placeId) {
            e.stop(); 
    }
  }

  
  return <div className="mobile-app" style={{position:"fixed", inset: 0, overflow:"hidden"}}><APIProvider apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY}>
      <Map
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
  <MobileSearch />
  <div style={{position:"fixed",left:24,top:74}}>  <Updater /> </div>
      <GeoLocation />
      <DirectionServicer />
         <Legend />
    </Map>
    
   
  
  </APIProvider></div>
}
export default MapPanel