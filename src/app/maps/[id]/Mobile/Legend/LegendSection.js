import React, { useContext, useState, useRef,useLayoutEffect } from "react"
import svgImgUrl from "@/app/lib/svgImgUrl"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"

import Pin from "../../sharedComponents/Pin"
import { useMap } from "@vis.gl/react-google-maps"
import mapCenterer from "../lib/mapCenterer"
import Button from "@/app/components/Button"
import { useCallback ,memo} from "react"

import styles from "./styles.module.css";
import LegendSectionEditingPanel from "./LegendSectionEditingPanel"
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiPencilLine ,RiArrowDownSLine , RiArrowUpSLine} from "@remixicon/react"

const PinItem = ({activePin,pin,isActive,activatePin,activePin}) => {
    const containerRef = useRef(null);
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
                <Pin pin={pin} className={`${styles.legendPin} ${pin?.favorited?styles.favorited:""}`} mobile={true} onMap={true} layer={layer} size={14}/>
            </div>
            <div className={`${styles.pinName} ${pin.favorited?styles.favorited:""} overflow-ellipsis`} style={{textDecoration: pin?.visited?"line-through":""}}>
                {pin.title}
            </div>

        </div>

        
    )
    

}


const LegendSectionWrapper = ({layer}) => {
    const {activeDispatch, activeData} = useContext(MobileActiveContext)
    if(!activeData) return ;
    const {disabledLayers, activePin,expandedLayers} = activeData
    const isActive = !disabledLayers.includes(layer.id);
    const map = useMap();
    const props = {layer,isActive,map,activeDispatch,expandedLayers,activePin}
    return <LegendSectionMemo {...props} />
}



const LegendSection = (props) => {
  const  {layer,isActive,map,activeDispatch,expandedLayers,activePin} = props

  const [isEditing,updateIsEditing] = useState(false)
 
   

  
  
  

  
  
  const headerClick = useCallback(() => {
    console.log("clicked");
    if(isActive) {
      activeDispatch({type: "ADD_DISABLED_LAYER",id: layer.id})
    } else {
      activeDispatch({type: "REMOVE_DISABLED_LAYER",id:layer.id})
    }
  },[isActive])

  const activatePin = useCallback((pin) => {
    if(!isActive) return ; 
    

    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type: "LEGEND_OPEN", state: false})
    activeDispatch({type:"BACK_STATE",state:"back_to_legend"})
    mapCenterer(map,pin.location)
  },[map,isActive]);
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
  
  return <><div className={styles.legendSection}>
    <div className={`${styles.legendSectionheader} flex-center`} >
      <button className={styles.legendSectionheaderCheckBox} onClick={headerClick}>
        {isActive? <RiCheckboxCircleFill width={16} height={16} /> : <RiCheckboxCircleLine width={16} height={16}/>}
      </button>
      <div className={`${styles.legendSectionheaderTitle} overflow-ellipsis flex-1 flex-center`}>
        {layer.icon && <img style={{marginRight:4}} width={16} height={16} src={svgImgUrl({icon:layer.icon,picker:true})}/>}
      <span className="flex-1 overflow-ellipsis">{layer.title}</span></div>
      <button onClick={(e)=>{e.preventDefault(); updateIsEditing(true)}}><RiPencilLine width={16} height={16} /></button>
    </div>
    <div className={`${styles.pins}`}>
        {pins.map(pin=> {
          const classString = `${styles.legendSectionPin} ${!isActive ? styles.disabled:""} ${activePin == pin.id?styles.active : ""}`
          return <div className={`${classString } flex-center`} key={pin.id} onClick={()=>{activatePin(pin)}}  >
          <div className={`${styles.pinIcon} ${pin.favorited? styles.favorited:""} flex-center-center`}> 
            <Pin pin={pin} className={`${styles.legendPin} ${pin?.favorited?styles.favorited:""}`} mobile={true} onMap={true} layer={layer} size={14}/>
          </div>
          <div className={`${styles.pinName} ${pin.favorited?styles.favorited:""} overflow-ellipsis`} style={{textDecoration: pin?.visited?"line-through":""}}>
            {pin.title}
          </div>
          </div>
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
      {isEditing && <LegendSectionEditingPanel cancelFunction={()=>{updateIsEditing(false)}} layerData={layer} />}
  </div>
  <hr className={styles.sectionDivider} />
  </> 

}

const LegendSectionMemo = memo(LegendSection);

export default LegendSectionWrapper;
