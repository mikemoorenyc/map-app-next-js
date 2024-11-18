import { useContext } from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import Pin from "../../sharedComponents/Pin";
import mapCenterer from "../lib/mapCenterer";
import { useMap } from "@vis.gl/react-google-maps";
import DataContext from "@/app/contexts/DataContext";

const Marker = ({pin, active}) => {

  const {activeDispatch} = useContext(MobileActiveContext);
  const map = useMap(); 
  const markerClicked = () => {
    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    mapCenterer(map, pin.location);
  }
  return <AdvancedMarker onClick={markerClicked} position={pin.location} zIndex={active || pin.favorited ? 999999 : null}>
    <Pin windowOpen={false} interactable={true} size={13} pId={pin.id} highlighted={active} mobile={true}/>
  </AdvancedMarker>
  
}
export default Marker;