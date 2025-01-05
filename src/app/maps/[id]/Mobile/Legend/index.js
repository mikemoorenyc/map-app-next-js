import  { useContext } from "react"

import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import LegendSection from "./LegendSection"
import {  PlusCircleSolid, Xmark } from "iconoir-react"
import Button from "@/app/components/Button"
import DataContext from "@/app/contexts/DataContext"
import styles from "./styles.module.css";

const Legend = () => {
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  
  const {layerData,pageTitle,layerDispatch} = useContext(DataContext);
  const mapData = layerData
 
  const legendIsOpen = activeData?.legendOpen && activeData?.drawerState != "editing" 
  
  return <div className={`${styles.legend} ${legendIsOpen ? styles.open : ""}`}>
    <div className={`${styles.legendHeader} flex-center`}>
      <div className={`${styles.legendTitle} overflow-ellipsis flex-1`}>{pageTitle}</div>
      
      <Button className={styles.legendHeaderButton} modifiers={["secondary"]} onClick={(e)=>{
        e.preventDefault(); 
        activeDispatch({type:"LEGEND_OPEN",state:false})
        activeDispatch({type:"BACK_STATE",state:"base"})
        }} icon={<Xmark />}> <span>Close</span></Button>
    </div>
    <div className={`${styles.legendSections} flex-1`}>
    {mapData.map(l => {

      return <LegendSection key={l.id} layer={l} />;
    })}
    <div className={styles.legendSection}>
    <Button icon={<PlusCircleSolid />} onClick={(e)=>{
      e.preventDefault();
      layerDispatch({type:"ADDED_LAYER"})
      
      }} >Add a layer</Button>
    </div>
    </div>
    
  
  </div>
}

export default Legend; 
