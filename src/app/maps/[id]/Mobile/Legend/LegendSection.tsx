import React, { useContext, useState, useRef,useLayoutEffect,Suspense,lazy} from "react"
import svgImgUrl from "@/app/lib/svgImgUrl"
//import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import { useMap } from "@vis.gl/react-google-maps"
import Pin from "../../sharedComponents/Pin"
import mapCenterer from "../lib/mapCenterer"
import Button from "@/app/components/Button"
import { useCallback ,memo} from "react"
import { TLayer, TPin } from "@/projectTypes"
import styles from "./styles.module.css";
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiPencilLine ,RiArrowDownSLine , RiArrowUpSLine} from "@remixicon/react"
import ModalLoading from "../_components/ModalLoading"
import DataContext from "@/app/contexts/DataContext"
import useActiveStore from "@/app/contexts/useActiveStore"

const LegendSectionEditingPanel = lazy(()=>import("./LegendSectionEditingPanel"))

type PinItemProps = {
  activePin:number|string|null,
  pin:TPin,
  isActive:boolean,
  activatePin:(pin:TPin)=> void,
  layer:TLayer
}

const PinItem = ({activePin,pin,isActive,activatePin,layer}:PinItemProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const classString = `${styles.legendSectionPin} ${!isActive ? styles.disabled:""} ${activePin == pin.id?styles.active : ""}`
  
    

    useLayoutEffect(()=> {
        if(!containerRef.current || !isActive) return ; 
        if(activePin === pin.id) {
            containerRef.current.scrollIntoView({block: "center"})
        }
    },[containerRef,activePin])
    return (
        <div ref={containerRef} className={`${classString } flex-center`} onClick={()=>{activatePin(pin)}}>
            <div className={`${styles.pinIcon} ${pin.favorited? styles.favorited:""} flex-center-center`}> 
                <Pin pin={pin} className={`${styles.legendPin} ${pin?.favorited?styles.favorited:""}`}  onMap={true} layer={layer} size={14}/>
            </div>
            <div className={`${styles.pinName} ${pin.favorited?styles.favorited:""} overflow-ellipsis`} style={{textDecoration: pin?.visited?"line-through":""}}>
                {pin.title}
            </div>

        </div>

        
    )
    

}

type PropsLegendSection = {
  layer:TLayer,

}

const LegendSectionWrapper = ({layer}:{layer:TLayer}) => {
   // const {activeDispatch, activeData} = useContext(MobileActiveContext)
  
   // const {disabledLayers, activePin,expandedLayers, canEdit} = activeData
//  const disabledLayers = useActiveStore(s=>s.disabledLayers);
  //const expa 
  //const isActive = !disabledLayers.includes(layer.id);


    const props = {layer}
    return <LegendSectionMemo {...props} />
}



const LegendSection = (props:PropsLegendSection) => {
  const  {layer}= props

  const map = useMap(); 
  const {nonEditing} = useContext(DataContext);
  const [isEditing,updateIsEditing] = useState(false)
  const disabledLayers = useActiveStore(s=>s.disabledLayers);
  const isActive = !disabledLayers.includes(layer.id);
  const activePin = useActiveStore(s=>s.activePin);
  const expandedLayers = useActiveStore(s=>s.expandedLayers);
  const canEdit = useActiveStore(s=>s.canEdit);
  const updateDisabledLayer = useActiveStore(s=>s.updateDisabledLayer)
  const updateActivePin = useActiveStore(s=>s.updateActivePin);
  const updateDrawerState = useActiveStore(s=>s.updateDrawerState);
  const updateLegendOpen = useActiveStore(s=>s.updateLegendOpen);
  const updateBackState = useActiveStore(s=>s.updateBackState);
  const updateExpandedLayer = useActiveStore(s=>s.updateExpandedLayer);
 
   

  
  
  

  
  
  const headerClick = useCallback(() => {
    console.log("clicked");
    if(isActive) {
      /*activeDispatch({type: "ADD_DISABLED_LAYER",id: layer.id})*/
      /*activeDispatch({type:"UPDATE_DISABLED_LAYER",
        id:layer.id,
        disabled: true
      })*/
     updateDisabledLayer(true,layer.id);
    } else {
      /*activeDispatch({type: "REMOVE_DISABLED_LAYER",id:layer.id})*/
      /*activeDispatch({type:"UPDATE_DISABLED_LAYER",
        id:layer.id,
        disabled: false
      })*/
     updateDisabledLayer(false,layer.id);
    }
  },[isActive])

  const activatePin = useCallback((pin:TPin) => {
    if(!isActive||!map) return ; 
    updateActivePin(pin.id);
    updateDrawerState("open");
    updateLegendOpen(false);
    updateBackState("back_to_legend");

 
  },[mapCenterer,map]);
  const cutoff = 4
  
  const containsActivePin = layer.pins.filter(p => p.id == activePin).length

  const openedManually = expandedLayers.includes(layer.id)
  const isExpanded = openedManually || containsActivePin;

  const pins = (isExpanded ) ? layer.pins : layer.pins.slice(0,cutoff);
  /*
  const ExpandButton = () => {
    if(layer.pins.length <= cutoff || containsActivePin ) return ; 
    return <div className={styles.expandButton} ><Button onClick={()=>{console.log(expanded);updateExpanded(!expanded)}} icon={!expanded?<ArrowDownCircle />:<ArrowUpCircle/>} modifiers={["ghost"]}>
    Show {!expanded?"all":"less"}
    </Button></div>
  }
  */
  const size=16;

  return <><div className={styles.legendSection}>
    <div className={`${styles.legendSectionheader} flex-center`} >
      <button className={styles.legendSectionheaderCheckBox} onClick={headerClick}>
        {isActive? <RiCheckboxCircleFill {...{size}} /> : <RiCheckboxCircleLine {...{size}}/>}
      </button>
      <div className={`${styles.legendSectionheaderTitle} overflow-ellipsis flex-1 flex-center`}>
        {layer.icon && <img style={{marginRight:4}} width={size} height={size} src={svgImgUrl({icon:layer.icon,picker:true})}/>}
      <span className="flex-1 overflow-ellipsis">{layer.title}</span></div>
      {(!nonEditing && canEdit) && <button onClick={(e)=>{e.preventDefault(); updateIsEditing(true)}}><RiPencilLine {...{size}}/></button>}
    </div>
    <div className={`${styles.pins}`}>
        {pins.map(pin=> {
         return <PinItem key={pin.id} {...{layer,pin,activePin,isActive,activatePin}}/>
        })}
      {layer.pins.length > cutoff && !containsActivePin && (
        <div className={styles.expandButton} > 
          <Button
            icon={!isExpanded?<RiArrowDownSLine />:<RiArrowUpSLine/>}
            modifiers={["secondary","sm"]}
            onClick={(e)=> {
              e.preventDefault(); 
              updateExpandedLayer(openedManually?"collapsed":"expanded",layer.id)
              //activeDispatch({type: "UPDATE_EXPANDED_LAYERS", id:layer.id,state: openedManually?"collapsed":"expanded"})
            }}
          >
            Show {!isExpanded?"all":"less"}
          </Button>
        </div>
      )}
      </div>
      {isEditing && <Suspense fallback={<ModalLoading />}><LegendSectionEditingPanel cancelFunction={()=>{updateIsEditing(false)}} layerId={layer.id} /></Suspense>}
  </div>
  <hr className={styles.sectionDivider} />
  </> 

}

const LegendSectionMemo = memo(LegendSection);

export default LegendSectionWrapper;
