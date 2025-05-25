import  { useContext ,useRef} from "react"

import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import LegendSection from "./LegendSection"

import Button from "@/app/components/Button"
import DataContext from "@/app/contexts/DataContext"
import styles from "./styles.module.css";
import { RiCloseLine, RiStackLine } from "@remixicon/react"

const Legend = () => {
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  
  const {layerData,pageTitle,layerDispatch} = useContext(DataContext);
  const mapData = layerData
 
  const legendIsOpen = activeData?.legendOpen && activeData?.drawerState != "editing" 
  const legendScroll = useRef(null);
  
  return <div className={`${styles.legend} ${legendIsOpen ? styles.open : ""}`}>
    <div className={`${styles.legendHeader} flex-center`}>
      <div className={`${styles.legendTitle} overflow-ellipsis flex-1`}>{pageTitle}</div>
      
      <Button className={styles.legendHeaderButton} modifiers={["secondary","icon","round"]} onClick={(e)=>{
        e.preventDefault(); 
        activeDispatch({type:"LEGEND_OPEN",state:false})
        activeDispatch({type:"BACK_STATE",state:"base"})
        }} icon={<RiCloseLine />} />
    </div>
    <div className={`${styles.legendSections} flex-1`} ref={legendScroll}>
    {mapData.map(l => {

      return <LegendSection key={l.id} layer={l} />;
    })}
    <div className={styles.addSection}>
    <Button icon={<RiStackLine/>} modifiers={["raised"]} onClick={(e)=>{
      e.preventDefault();
      layerDispatch({type:"ADDED_LAYER"})
      legendScroll.current.scrollTop = legendScroll.current.scrollHeight + 500
      
      }} >Add a layer</Button>
    </div>
    </div>
    
  
  </div>
}

export default Legend; 
