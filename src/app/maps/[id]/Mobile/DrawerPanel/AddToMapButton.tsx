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
import useActiveStore from "@/app/contexts/useActiveStore";

function AddToMapButton() {
  const tempData = useActiveStore(s=>s.tempData)
  const canEdit = useActiveStore(s=>s.canEdit);
  const updateActivePin = useActiveStore(s=>s.updateActivePin);
  const updateDrawerState = useActiveStore(s=>s.updateDrawerState);
  

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
    updateActivePin(tempID);
    updateDrawerState("open")
  
  }


const btnMods = addDisabledMod(["secondary","bigger","pill"],!canEdit)
return <div className={`flex-1`}><Button onClick={addPin} icon={<RiMapPinAddLine/>} modifiers={btnMods}>
          Add to map
        </Button></div>

}

export default () => <ClientSideSuspense fallback={<></>}><AddToMapButton  /></ClientSideSuspense>