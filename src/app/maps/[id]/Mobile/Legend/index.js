import  { useContext } from "react"

import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import LegendSection from "./LegendSection"
import { Map, Xmark } from "iconoir-react"
import Button from "@/app/components/Button"
import DataContext from "@/app/contexts/DataContext"
import styles from "./styles.module.css";

const Legend = () => {
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  
  const {layerData,pageTitle} = useContext(DataContext);
  const mapData = layerData
  console.log(activeData.legendOpen);
  
  return <div className={`${styles.legend} ${activeData?.legendOpen ? styles.open : ""}`}>
    <div className={`${styles.legendHeader} flex-center`}>
      <div className={`${styles.legendTitle} overflow-ellipsis flex-1`}>{pageTitle}</div>
      <Button className={styles.legendHeaderButton} modifiers={["secondary","sm"]} link={true} url={"/"} icon={<Map />}> <span>All maps</span></Button>
      <Button className={styles.legendHeaderButton} modifiers={["secondary","sm"]} onClick={(e)=>{e.preventDefault(); activeDispatch({type:"LEGEND_OPEN",state:false})}} icon={<Xmark />}> <span>Close</span></Button>
    </div>
    <div className={`${styles.legendSections} flex-1`}>
    {mapData.map(l => {

      return <LegendSection key={l.id} layer={l} />;
    })}
    </div>
  
  </div>
}

export default Legend; 
