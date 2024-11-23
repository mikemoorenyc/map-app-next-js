import React, { useContext, useEffect, useState } from "react"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import { ArrowDownCircle,  ArrowUpCircle, CheckCircle, CheckCircleSolid } from "iconoir-react"
import Pin from "../../sharedComponents/Pin"
import { useMap } from "@vis.gl/react-google-maps"
import mapCenterer from "../lib/mapCenterer"
import Button from "@/app/components/Button"
import DataContext from "@/app/contexts/DataContext"

import styles from "./styles.module.css";
const LegendSection = ({layer}) => {
  const {activeDispatch, activeData} = useContext(MobileActiveContext)
  const {layerData} = useContext(DataContext)
  const mapData = layerData
  const map = useMap(); 
  if(!activeData) return ;
  
  const {activeLayers, activePin} = activeData
  
  if(!activeLayers) {
    return ; 
  }
  const isActive = activeLayers.includes(layer.id);
  
  const headerClick = () => {
    if(isActive) {
      activeDispatch({type: "REMOVE_ACTIVE_LAYER",id: layer.id})
    } else {
      activeDispatch({type: "ADD_ACTIVE_LAYER",id:layer.id})
    }
  }

  const activatePin = (pin) => {
    if(!isActive) return ; 
    

    activeDispatch({type:"SET_ACTIVE_PIN",id:pin.id})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
    activeDispatch({type: "LEGEND_OPEN", state: false})
    mapCenterer(map,pin.location)
  }
  const cutoff = 4
  const [expanded,updateExpanded] = useState(false);
  const containsActivePin = layer.pins.filter(p => p.id == activePin).length
  useEffect(()=> {
    console.log("update expand");
    if(layer.pins.filter(p => p.id == activePin).length) {
      updateExpanded(true)
    } else {
      updateExpanded(false);
    }
  },[activePin])

  const pins = (expanded ) ? layer.pins : layer.pins.slice(0,cutoff);
  
  const ExpandButton = () => {
    if(layer.pins.length <= cutoff || containsActivePin ) return ; 
    return <div className={styles.expandButton} ><Button onClick={()=>{console.log(expanded);updateExpanded(!expanded)}} icon={!expanded?<ArrowDownCircle />:<ArrowUpCircle/>} modifiers={["ghost"]}>
    Show {!expanded?"all":"less"}
    </Button></div>
  }
  
  return <div className={styles.legendSection}>
    <div className={`${styles.legendSectionheader} flex-center`} onClick={headerClick}>
      <button className={styles.legendSectionheaderCheckBox}>
        {isActive? <CheckCircleSolid width={16} height={16} /> : <CheckCircle width={16} height={16}/>}
      </button>
      <div className={`${styles.legendSectionheaderTitle} overflow-ellipsis flex-1`}>{layer.title}</div>
    </div>
    <div className={`${styles.pins}`}>
        {pins.map(pin=> {
          const classString = `${styles.legendSectionPin} ${!isActive ? styles.disabled:""} ${activePin == pin.id?styles.active : ""}`
          return <div className={`${classString } flex-center`} key={pin.id} onClick={()=>{activatePin(pin)}}  >
          <div className="pin-icon"> 
            <Pin pin={pin} mobile={true} layer={layer} layerData={mapData}/>
          </div>
          <div className={`${styles.pinName} overflow-ellipsis`} style={{textDecoration: pin?.visited?"line-through":""}}>
            {pin.title}
          </div>
          </div>
        })}
      <ExpandButton />
      </div>
  </div>
}

export default LegendSection;