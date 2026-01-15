import   {  MouseEvent, SyntheticEvent, useContext,  } from "react";
import DataContext from "@/_contexts/DataContext";
import ActiveContext from "@/_contexts/ActiveContext";
import InfoWindowContext from "@/_contexts/InfoWindowContext";
import LocationDetails from "@/_components/LocationDetails";
import Button from "@/_components/Button";
import InfoWindowHeader from "./InfoWindowHeader";
import ActionBar from "../../../../../../_components/ActionBar";
import { RiMapPinAddLine } from "@remixicon/react";
import useLiveEditing from "@/_lib/useLiveEditing";
import {  TPinTemp, TPin } from "@/projectTypes";
import addDisabledMod from "@/_lib/addDisabledMod";
import { TSearchPin } from "@/_components/ModernSearch/lib/fieldMapping";
import useLayerData from "@/_lib/useLayerData";
import useActiveStore from "@/_contexts/useActiveStore";
import { useMyPresence } from "@liveblocks/react";

export default ({ placeData}:{placeData:TSearchPin}) => {

  const {activeDispatch} = useContext(ActiveContext);
  const layerData = useLayerData().layers;
  const dispatchEvent = useLiveEditing(); 
  const activeLayer = useActiveStore(s=>s.activeLayer);
  const canEdit = useActiveStore(s=>s.canEdit);
  const [prescence] = useMyPresence(); 
  if(!prescence.email||!prescence.name) return ; 
  const user = {
    email:prescence.email,
    name:prescence.name
  }

    const {infoWindowDispatch } = useContext(InfoWindowContext);
    const {website,title,formatted_address,url,location,viewport} = placeData
    const tempID = placeData.id;
    if(activeLayer||!location||!viewport) {
            return false; 
        }
    const formattedPinData:TPin = {
                title: title,
                website: website,
                formatted_address:formatted_address,
              /*  international_phone_number:international_phone_number,*/
                url:url,

       
                id: tempID,
                location: location ,
                viewport: viewport,

                layerId : activeLayer|| layerData[0].id,
                createdBy: user||null

    }

    
    const addItem = (e:SyntheticEvent) => {
    


        if(!activeLayer||!location||!viewport) {
            return false; 
        }
        
        
        e.preventDefault(); 
        console.log("clicked")
        dispatchEvent([{
            type: "ADDED_PIN",
            
            layerToAdd: activeLayer,
            pinData : formattedPinData
        }])
        infoWindowDispatch({type:"CLOSE_WINDOW"});
        activeDispatch({
            type: "EDITING_PIN", 
            id: tempID
        })
        
    }

    return <>
    <InfoWindowHeader>
        {title}
    </InfoWindowHeader>
    <div className="description-placeholder"  style={{height: "var(--edit-description-height)"}}  />
    <LocationDetails placeData={formattedPinData} />
    <ActionBar  primaryButtons={<Button modifiers={addDisabledMod(['sm'],!canEdit)} onClick={addItem} icon={<RiMapPinAddLine />}>
    
    <span className={"Button-text"}>Add to map</span>
</Button>} />
        
    </>
}