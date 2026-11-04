import React, {useContext, useEffect,memo } from "react"
import {  AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

import Pin from "../../sharedComponents/Pin";
import PinDisplay from "./PinEditWindow/PinDisplay";
import mapMover from "./lib/mapMover";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";


import useLayerData from "@/app/lib/useLayerData";

type TProps = {
  pId: string | number,
  indexNum:number
}

const PinMarker = ({ pId, indexNum, isHighlighted, activeDispatch, editingPin }: TProps & { isHighlighted: boolean, editingPin: string | number | null, activeDispatch: Function }) => {
  console.log("render");
    const layerD = useLayerData();
    const {infoWindowDispatch} = useContext(InfoWindowContext);


    const pin = layerD.findPin(pId);
    if(!pin) return ;
    const layer = layerD.findLayer(pin.layerId);
    if(!layer) return false;
    const {location} = pin;

  const map = useMap();
  useEffect(()=> {

      if(!map) return ;
      //DO NOTHING NOT THE RIGHT PIN
      if(editingPin !== pin.id) return ;
      //INFO WINDOW ALREADY OPEN

     // if(infoWindowState.infoWindowShown) return ;

      //IT IS OUR PIN AND IT"S NOT OPEN
      infoWindowDispatch({
          type: "OPEN_WINDOW",
          position: location,
          content: {
                  header: "",
                  body: <PinDisplay ></PinDisplay>
              }

          })
          mapMover(map,location);


  },[editingPin])

  const handleClick = (e: google.maps.marker.AdvancedMarkerClickEvent) => {

        if(editingPin === pin.id) return ;
        activeDispatch({
            type: "EDITING_PIN",
            id:pin.id
        })
        activeDispatch({
            type:"ACTIVE_LAYER",
            id: layer.id
        })
    }


    let zindex = pin?.favorited ? 999 : 1;
    const highlighted = isHighlighted;
    if(highlighted) {
        zindex=9999;
    }


    return <AdvancedMarker onMouseEnter={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:pin.id})}}
    onMouseLeave={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})}} zIndex={zindex} onClick={handleClick}  position={location}>
    <Pin onMap={true}   highlighted={highlighted}  interactable={true} layer={layer}   pin={pin}  size={16} />
    </AdvancedMarker>
}
const PinMarkerMemo = memo(PinMarker);
export default function (props: TProps) {
  const { pId } = props;
  const { activeDispatch, activeData } = useContext(ActiveContext)
  const {hoveringPin,editingPin} = activeData
  const isHighlighted = pId == editingPin || pId == hoveringPin;
  return <PinMarkerMemo {...{ ...props, ...{isHighlighted,editingPin,activeDispatch} }} />
}
