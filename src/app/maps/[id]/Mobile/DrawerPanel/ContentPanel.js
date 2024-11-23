import { useContext } from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import Pin from "../../sharedComponents/Pin";
import Button from "@/app/components/Button";
import LocationDetails from "@/app/components/LocationDetails";
import { EditPencil, List, MapPinPlus } from "iconoir-react";
import Linkify from "linkify-react";
import GMIcon from "./GMIcon";
import makeNativeLink from "../lib/makeNativeLink";
import DrawerPanelHeader from "./DrawerPanelHeader";
import styles from "./styles.module.css";
import AddToMapButton from "./AddToMapButton";

const ContentPanel = ({pinId, $transform})=> {
  const {activeDispatch, activeData} = useContext(MobileActiveContext)
  const {layerData} = useContext(DataContext);
  
  
  const {drawerState} = activeData;
  const pin = pinId == "temp" ? activeData.tempData : layerData.map(l=>l.pins).flat().find(pin => pin.id == pinId);
  const layer = pinId == "temp" ? null : layerData.find(l => l.id == pin.layerId);
  if(!pin) return;

  return <div className={styles.contentPanel}>
    <div className="top-section">
      <DrawerPanelHeader 
        title={pin.title} 
        before={pin?.icon && <div className="header-icon" style={{paddingRight: 4}}><Pin layerData={layerData} pId={pin.id} interactable={false}/></div>} 
        contentOpen={true} />
         
      <div className={`${styles.metadata} display-flex align-items-center`} >
        {layer && <div className={`layer flex-1`}>
          {layer.title}
        </div>}
        {pinId == "temp" && <AddToMapButton />}
        {pinId != "temp" && <Button  modifiers={["bigger","secondary"]} onClick={(e)=>{(e).preventDefault(); activeDispatch({type:"DRAWER_STATE",state:"editing"})}}>
          <EditPencil width={16} height={16}/>
        </Button>}
        <Button  modifiers={["bigger"]} style={{marginLeft:12}} onClick={(e)=>{(e).preventDefault(); activeDispatch({type:"LEGEND_OPEN",state:true})}}>
          <List width={16} height={16}/>
        </Button>
        {pin?.url &&<Button style={{marginLeft:12}} modifiers={["bigger", ""]} target={"_blank"} href={makeNativeLink(pin.url)}>
          <GMIcon />
        </Button>}
      </div>
    </div>
    <div className={styles.bottomSection}>
      <div className={styles.description}>
        <Linkify options={{target: "_blank"}}>{pin.description}</Linkify>
      </div>
      <div style={{padding: "0 16px"}}>
        <LocationDetails placeData={pin} />
      </div>
    </div>
  </div>
}
export default ContentPanel; 