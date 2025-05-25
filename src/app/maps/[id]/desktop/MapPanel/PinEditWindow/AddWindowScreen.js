import   {  useContext,  } from "react";
import DataContext from "@/app/contexts/DataContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import LocationDetails from "@/app/components/LocationDetails";
import Button from "@/app/components/Button";
import InfoWindowHeader from "./InfoWindowHeader";
import ActionBar from "../../../sharedComponents/ActionBar";
import { RiMapPinAddLine } from "@remixicon/react";

export default ({clickEvent, placeData,state,anchor,closeFunction,outsideClick}) => {
  console.log("opens")
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const {layerDispatch} = useContext(DataContext);
    const {infoWindowState,infoWindowContent,infoWindowDispatch } = useContext(InfoWindowContext);
    const {website,name,formatted_address,international_phone_number,url,geometry} = placeData
    const addItem = (e) => {
        const tempID = Date.now()
        e.preventDefault(); 
        console.log("clicked")
        layerDispatch({
            type: "ADDED_PIN",
            
            layerToAdd: activeData.activeLayer,
            pinData : {
                title: name,
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
                layerId : activeData.activeLayer
            }
        })
        infoWindowDispatch({type:"CLOSE_WINDOW"});
        activeDispatch({
            type: "EDITING_PIN", 
            id: tempID
        })
        
    }
    return <>
    <InfoWindowHeader>
        {name}
    </InfoWindowHeader>
    <div className="description-placeholder"  style={{height: "var(--edit-description-height)"}}  />
    <LocationDetails placeData={placeData} />
    <ActionBar  primaryButtons={<Button modifiers={["sm"]} onClick={addItem} icon={<RiMapPinAddLine />}>
    
    <span className={"Button-text"}>Add to map</span>
</Button>} />
        
    </>
}