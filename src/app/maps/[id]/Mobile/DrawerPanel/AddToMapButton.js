import Button from "@/app/components/Button";
import { useContext } from "react";
import DataContext from "@/app/contexts/DataContext";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";

import { RiMapPinAddLine } from "@remixicon/react";
import { ClientSideSuspense } from "@liveblocks/react";
import useLiveEditing from "@/app/lib/useLiveEditing";

function AddToMapButton() {
  const {layerData,user} = useContext(DataContext)
  const {activeData} = useContext(MobileActiveContext)
  const {activeDispatch} = useContext(MobileActiveContext);
  const tempData = activeData.tempData;
  if(!tempData) return ; 
  const {website,name,formatted_address,international_phone_number,url,geometry} = tempData
  const tempID = tempData.place_id
  const dispatchEvent = useLiveEditing(); 

  const addPin = (e) => {
    e.preventDefault(); 
    const payload = {
      title: name,
      createdBy: user||null,
      website: website,
      formatted_address:formatted_address,
     /* international_phone_number:international_phone_number, */
      url:url,
      description:null,
      icon: null  ,
      id: tempID,
      location: geometry.location.toJSON(),
      viewport: geometry.viewport.toJSON(),
      test: "asdfasd",
      layerId : layerData[0].id
    }
    dispatchEvent({
      type: "ADDED_PIN",
      layerToAdd: layerData[0].id,
      pinData : payload,
    })
    activeDispatch({type:"SET_ACTIVE_PIN",id:tempID})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
  }
  


return <div className={`flex-1`}><Button onClick={addPin} icon={<RiMapPinAddLine/>} modifiers={["secondary","bigger","pill",!activeData.canEdit?"disabled":""]}>
          Add to map
        </Button></div>

}

export default (props) => <ClientSideSuspense><AddToMapButton {...props} /></ClientSideSuspense>