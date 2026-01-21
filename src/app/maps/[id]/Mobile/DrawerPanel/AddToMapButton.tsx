import Button from "@/app/components/Button";
import { SyntheticEvent, useContext } from "react";
import DataContext from "@/app/contexts/DataContext";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";

import { RiMapPinAddLine } from "@remixicon/react";
import { ClientSideSuspense, useMyPresence } from "@liveblocks/react";
import useLiveEditing from "@/app/lib/useLiveEditing";
import { TGeolocation, TPlaceDetails, TViewport } from "@/projectTypes";
import addDisabledMod from "@/app/lib/addDisabledMod";
import { useLayers } from "@/app/lib/useLayerData";

function AddToMapButton() {
  
  const {activeData} = useContext(MobileActiveContext)
  const {activeDispatch} = useContext(MobileActiveContext);
  const tempData = activeData.tempData;
  if(!tempData) return ; 
  const {website,title,formatted_address,international_phone_number,url,location,viewport}  = tempData
  const tempID = tempData.id
  const dispatchEvent = useLiveEditing(); 
  const [prescence] = useMyPresence();
  const layerData = useLayers(); 
  if(!prescence.email && !prescence.name) return ;

  const addPin = (e:SyntheticEvent) => {
    e.preventDefault(); 
    const payload = {
      title: title,
      createdBy: prescence,
      website: website,
      formatted_address:formatted_address,
     /* international_phone_number:international_phone_number, */
      url:url,


      id: tempID,
      location: location,
      viewport: viewport,
  
      layerId : layerData[0].id
    }
    dispatchEvent([{
      type: "ADDED_PIN",
      layerToAdd: layerData[0].id,
      pinData : payload,
    }])
    activeDispatch({type:"SET_ACTIVE_PIN",id:tempID})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
  }
  

const btnMods = addDisabledMod(["secondary","bigger","pill"],!activeData.canEdit)
return <div className={`flex-1`}><Button onClick={addPin} icon={<RiMapPinAddLine/>} modifiers={btnMods}>
          Add to map
        </Button></div>

}

export default () => <ClientSideSuspense fallback={<></>}><AddToMapButton  /></ClientSideSuspense>