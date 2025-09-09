import { useContext,useState} from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import Button from "@/app/components/Button";
import LocationDetails from "@/app/components/LocationDetails";
import Linkify from "linkify-react";
import GMIcon from "./GMIcon";
import makeNativeLink from "../lib/makeNativeLink";
import styles from "./styles.module.css";
import AddToMapButton from "./AddToMapButton";
import {  RiListUnordered, RiPencilLine } from "@remixicon/react";
import Directions from "./Directions";
import Photos from "./Photos";
import svgImgUrl from "@/app/lib/svgImgUrl";
import useLayerData from "@/app/lib/useLayerData";
import addDisabledMod from "@/app/lib/addDisabledMod";


type Props = {
  pinId: string|number,
  drawerTopSpace:number
}

const ContentPanel = ({pinId, drawerTopSpace}:Props)=> {

  const {activeDispatch, activeData} = useContext(MobileActiveContext)
  const {routes,inBounds,geolocation} = activeData;
  const {drawerState,canEdit} = activeData
  const {findLayer,findPin} = useLayerData(); 

  const pin = pinId == "temp" ? activeData.tempData : findPin(pinId)
  if(!pin) return;
  const layer = (pinId == "temp" || !pin?.layerId) ? null : findLayer(pin.layerId);
  


  return <div className={styles.contentPanel} style={{height:`calc(100% - ${drawerTopSpace}px)`}}>
    <div className={`${styles.topSection}`}>
     
        <div className={styles.pinTitle}>{pin.title}</div> 
      <div className={`${styles.metadata} display-flex align-items-center`} >
        
        {layer && <div className={`${styles.layerTitle} flex-1  flex-center`}>
         {layer.icon && <img style={{marginRight:4}} width={16} height={16} src={svgImgUrl({icon:layer.icon})}/>} <span className="flex-1 overflow-ellipsis">{layer.title}</span>
        </div>}
        {pinId == "temp" && <AddToMapButton />}
        {pinId != "temp" && <Button icon={<RiPencilLine />} onClick={(e)=>{(e).preventDefault(); activeDispatch({type:"DRAWER_STATE",state:"editing"})}} modifiers={addDisabledMod(["icon","round","secondary","sm"],!canEdit)}/>}
        <Button icon={<RiListUnordered />} modifiers={["icon","round","secondary","sm"]} style={{marginLeft:8}} onClick={(e)=>{(e).preventDefault(); activeDispatch({type:"LEGEND_OPEN",state:true})}} />
        {pin?.url &&<Button style={{marginLeft:8}} modifiers={["bigger", "round","icon"]} target={"_blank"} href={makeNativeLink(pin.url)} icon={  <GMIcon />}/>}
      </div>
    </div>
    <div className={styles.bottomSection} style={activeData.drawerState !== "maximized"?{overflow:"hidden"}:undefined}>
      
      {pin.description && <div className={styles.description}>
        <Linkify options={{target: "_blank"}}>{pin.description}</Linkify>
      </div>}
      {(routes && geolocation) && <Directions {...{pin,geolocation}} />}
      <div style={{paddingBottom: 16}}>
        <LocationDetails placeData={pin} isMobile={true} inBounds={inBounds}/>
      </div>
      {typeof (pin.id || pin.id) == "string"  && <Photos pin={pin} temp={pinId=="temp"} id={pin.id || pin.id} {...{drawerState}} />}
        
      
    </div>
  </div>
 
}
export default ContentPanel; 

//{drawerState == "maximized" && <Photos id={pin.id || pin.place_id} {...{drawerState}} />}

//{geolocation && inBounds && <Directions pin={pin} />}


/*
   <DrawerPanelHeader 
        title={pin.title} 
        before={pin?.icon && <div className="header-icon" style={{paddingRight: 4}}><Pin layerData={layerData} pId={pin.id} interactable={false}/></div>} 
        contentOpen={true} />
        */