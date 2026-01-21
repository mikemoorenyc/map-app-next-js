import   {  MouseEvent, SyntheticEvent, useContext,useEffect,useState  } from "react";
import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import LocationDetails from "@/app/components/LocationDetails";
import Button from "@/app/components/Button";
import InfoWindowHeader from "./InfoWindowHeader";
import ActionBar from "../../../sharedComponents/ActionBar";
import { RiMapPinAddLine } from "@remixicon/react";
import useLiveEditing from "@/app/lib/useLiveEditing";
import {  TPinTemp, TPin } from "@/projectTypes";
import addDisabledMod from "@/app/lib/addDisabledMod";
import { TSearchPin } from "@/app/components/ModernSearch/lib/fieldMapping";
import { useLayers } from "@/app/lib/useLayerData";
import type { TUser } from "@/projectTypes";
import { useMyPresence } from "@liveblocks/react";

const AddPinButton = () => {
    
}

export default ({ placeData}:{placeData:TSearchPin}) => {

  const {activeData,activeDispatch} = useContext(ActiveContext);

  const layerData = useLayers();
  const dispatchEvent = useLiveEditing(); 
  const [user,updateUser] = useState<null|TUser>(null)
  const [prescence] = useMyPresence();

  useEffect(()=> {
    console.log(prescence);
    if(!prescence.email||!prescence.name) return ;
    updateUser({
        email:prescence.email,
        name:prescence.name
    })
  },[prescence])

    const {infoWindowDispatch } = useContext(InfoWindowContext);
    const {website,title,formatted_address,url,location,viewport} = placeData
    const tempID = placeData.id;
    if(!activeData.activeLayer||!location||!viewport) {
            return false; 
        }
    if(!user) return ;
    const formattedPinData:TPin = {
                title: title,
                website: website,
                formatted_address:formatted_address,
              /*  international_phone_number:international_phone_number,*/
                url:url,

       
                id: tempID,
                location: location ,
                viewport: viewport,
                createdBy:user,
                layerId : activeData.activeLayer|| layerData[0].id,
                

    }

    
    const addItem = (e:SyntheticEvent) => {
    


        if(!activeData.activeLayer||!location||!viewport) {
            return false; 
        }
        
        
        e.preventDefault(); 
        console.log("clicked")
        dispatchEvent([{
            type: "ADDED_PIN",
            
            layerToAdd: activeData.activeLayer,
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
    <ActionBar  primaryButtons={<Button modifiers={addDisabledMod(['sm'],!activeData.canEdit)} onClick={addItem} icon={<RiMapPinAddLine />}>
    
    <span className={"Button-text"}>Add to map</span>
</Button>} />
        
    </>
}