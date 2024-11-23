import styles from "./LayerSelector.module.css"
import {useContext,useEffect,useState} from "react"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import DataContext from "@/app/contexts/DataContext"
import { ArrowDownTag } from "iconoir-react"



export default function LayerSelector({updater,pinState}) {
  const {layerData} = useContext(DataContext)
  const currentLayer = layerData.find(l => l.id == pinState.layerId);
  const ldColor = currentLayer.lightOrDark == "light" ? "black" : "white"
  const maskStyles = {
    backgroundColor: currentLayer.color,
    borderColor: ldColor,
    color: ldColor
  }
  return(
<div className={styles.container}>
  <div className={`${styles.mask} flex-center`} style={maskStyles}>
    <div className={`${styles.maskLabel} flex-1`}>{currentLayer.title}</div>
    <div className={styles.maskIcon}> <ArrowDownTag /> </div>
  </div>
  <select className={styles.select} name="layerId" id={"layerId"} onChange={(e)=>{e.preventDefault(); updater(parseInt(e.target.value),"layerId")}} value={pinState.layerId}>
      {layerData.map(l => {
        return <option key={l.id} value={l.id}>{l.title}</option>
      })
      }
    
    </select>

</div>

  ) 

}