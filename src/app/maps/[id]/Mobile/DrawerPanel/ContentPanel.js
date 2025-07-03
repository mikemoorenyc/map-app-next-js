import { useContext, Suspense,lazy } from "react";
import MobileActiveContext from "@/app/contexts/MobileActiveContext";
import DataContext from "@/app/contexts/DataContext";
import Button from "@/app/components/Button";
import LocationDetails from "@/app/components/LocationDetails";
import Linkify from "linkify-react";
import GMIcon from "./GMIcon";
import makeNativeLink from "../lib/makeNativeLink";
import styles from "./styles.module.css";
import AddToMapButton from "./AddToMapButton";
import { RiImage2Line, RiListUnordered, RiPencilLine } from "@remixicon/react";
import Directions from "./Directions";
//import Photos from "./Photos";

const Photos = lazy(()=>import("./Photos"))


const ContentPanel = ({pinId, $transform,drawerTopSpace})=> {
  const {activeDispatch, activeData} = useContext(MobileActiveContext)
  const {layerData} = useContext(DataContext);
  const {routes,inBounds} = activeData;
  const {drawerState} = activeData

  const pin = pinId == "temp" ? activeData.tempData : layerData.map(l=>l.pins).flat().find(pin => pin.id == pinId);
  const layer = pinId == "temp" ? null : layerData.find(l => l.id == pin.layerId);
  if(!pin) return;


  return <div className={styles.contentPanel} style={{height:`calc(100% - ${drawerTopSpace}px)`}}>
    <div className={`${styles.topSection}`}>
     
        <div className={styles.pinTitle}>{pin.title}</div> 
      <div className={`${styles.metadata} display-flex align-items-center`} >
        
        {layer && <div className={`${styles.layerTitle} flex-1  flex-center`}>
         {layer.icon && <img style={{marginRight:4}} width={18} height={18} src={`/api/glyph?w=22&picker=true&icon=${layer.icon}`}/>} <span className="flex-1 overflow-ellipsis">{layer.title}</span>
        </div>}
        {pinId == "temp" && <AddToMapButton />}
        {pinId != "temp" && <Button icon={<RiPencilLine />} onClick={(e)=>{(e).preventDefault(); activeDispatch({type:"DRAWER_STATE",state:"editing"})}} modifiers={["icon","round","secondary","sm"]}/>}
        <Button icon={<RiListUnordered />} modifiers={["icon","round","secondary","sm"]} style={{marginLeft:8}} onClick={(e)=>{(e).preventDefault(); activeDispatch({type:"LEGEND_OPEN",state:true})}} />
        {pin?.url &&<Button style={{marginLeft:8}} modifiers={["bigger", "round","icon"]} target={"_blank"} href={makeNativeLink(pin.url)} icon={  <GMIcon />}/>}
      </div>
    </div>
    <div className={styles.bottomSection} style={activeData.drawerState !== "maximized"?{overflow:"hidden"}:undefined}>
      
      {pin.description && <div className={styles.description}>
        <Linkify options={{target: "_blank"}}>{pin.description}</Linkify>
      </div>}
      {routes && <Directions />}
      <div style={{paddingBottom: 16}}>
        <LocationDetails placeData={pin} isMobile={true} inBounds={inBounds}/>
      </div>
      {typeof (pin.id || pin.place_id) == "string" && drawerState == "maximized" && <Suspense fallback={<div className={styles.photoSkeleton}><RiImage2Line className={styles.photoPlaceholder} /> </div>}>
        <Photos id={pin.id || pin.place_id} {...{drawerState}} />
      </Suspense> }
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