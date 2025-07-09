import Button from "@/app/components/Button";
import { useContext } from "react";
import DataContext from "@/app/contexts/DataContext";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";

import { RiMapPinAddLine } from "@remixicon/react";

export default function AddToMapButton() {
  const {layerData,layerDispatch,user} = useContext(DataContext)
  const {activeData} = useContext(MobileActiveContext)
  const {activeDispatch} = useContext(MobileActiveContext);
  const tempData = activeData.tempData;
  if(!tempData) return ; 
  const {website,name,formatted_address,international_phone_number,url,geometry} = tempData
  const tempID = tempData.place_id

  const addPin = (e) => {
    e.preventDefault(); 
    const payload = {
      title: name,
      createdBy: user||null,
      website: website,
      formatted_address:formatted_address,
      international_phone_number:international_phone_number,
      url:url,
      description:null,
      icon: null  ,
      id: tempID,
      location: geometry.location.toJSON(),
      viewport: geometry.viewport.toJSON(),
      test: "asdfasd",
      layerId : layerData[0].id
    }
    layerDispatch({
      type: "ADDED_PIN",
      layerToAdd: layerData[0].id,
      pinData : payload,
    })
    activeDispatch({type:"SET_ACTIVE_PIN",id:tempID})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
  }
  


return <div className={`flex-1`}><Button onClick={addPin} icon={<RiMapPinAddLine/>} modifiers={["secondary","bigger","pill"]}>
          Add to map
        </Button></div>

}