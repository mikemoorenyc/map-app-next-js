import React, { useContext, useState, useRef,useLayoutEffect,Suspense,lazy} from "react"
import svgImgUrl from "@/app/lib/svgImgUrl"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import { useMap } from "@vis.gl/react-google-maps"
import Pin from "../../sharedComponents/Pin"
import mapCenterer from "../lib/mapCenterer"
import Button from "@/app/components/Button"
import { useCallback ,memo} from "react"
import { TLayer, TPin } from "@/projectTypes"
import styles from "./styles.module.css";
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiPencilLine ,RiArrowDownSLine , RiArrowUpSLine} from "@remixicon/react"
import ModalLoading from "../_components/ModalLoading"

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
  isActive:boolean,
  activeDispatch: Function, 
  expandedLayers : number[],
  activePin: string|number|null, 
  canEdit:boolean
}

const LegendSectionWrapper = ({layer}:{layer:TLayer}) => {
    const {activeDispatch, activeData} = useContext(MobileActiveContext)
    if(!activeData) return ;
    const {disabledLayers, activePin,expandedLayers, canEdit} = activeData
    const isActive = !disabledLayers.includes(layer.id);

    const props = {layer,isActive,activeDispatch,expandedLayers,activePin,canEdit}
    return <LegendSectionMemo {...props} />
}



const LegendSection = (props:PropsLegendSection) => {
  const  {layer,isActive,activeDispatch,expandedLayers,activePin,canEdit} = props

  const map = useMap(); 

  const [isEditing,updateIsEditing] = useState(false)
 
   

  
  
  

  
  
  const headerClick = useCallback(() => {
    console.log("clicked");
    if(isActive) {
      
      activeDispatch({type: "UPDATE_DISABLED_LAYER",id: layer.id,disabled:true})
    } else {
      activeDispatch({type: "UPDATE_DISABLED_LAYER",id: layer.id,disabled:false})
    }
  },[isActive])

  const activatePin = useCallback((pin:TPin) => {
    if(!isActive||!map) return ; 
    

    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type: "LEGEND_OPEN", state: false})
    activeDispatch({type:"BACK_STATE",state:"back_to_legend"})
    mapCenterer(map,pin.location)
 
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
      {canEdit && <button onClick={(e)=>{e.preventDefault(); updateIsEditing(true)}}><RiPencilLine {...{size}}/></button>}
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
              activeDispatch({type: "UPDATE_EXPANDED_LAYERS", id:layer.id,state: openedManually?"collapsed":"expanded"})
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
