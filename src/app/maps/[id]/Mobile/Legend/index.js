import  { useContext ,useRef,useState,Suspense,lazy} from "react"

import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import LegendSection from "./LegendSection"

import Button from "@/app/components/Button"
import DataContext from "@/app/contexts/DataContext"
import styles from "./styles.module.css";
import { RiArrowLeftFill,  RiSettingsLine,  RiStackLine } from "@remixicon/react"

const MapEditingPanel = lazy(()=>import("./MapEditingPanel"))

const Legend = () => {
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  
  const {layerData,pageTitle,layerDispatch,mapIcon,user} = useContext(DataContext);
  const mapData = layerData
 
  const legendIsOpen = activeData?.legendOpen && activeData?.drawerState != "editing" 
  const legendScroll = useRef(null);
  const [settingsOpen,updateSettingsOpen] = useState(false);
  
  return <div className={`${styles.legend} ${legendIsOpen ? styles.open : ""}`}>
  {legendIsOpen && (<>
    <div className={`${styles.legendHeader} flex-center`}>
      
      
      <Button className={styles.legendHeaderButton} modifiers={["ghost","secondary","icon","round"]} onClick={(e)=>{
        e.preventDefault(); 
        activeDispatch({type:"LEGEND_OPEN",state:false})
        activeDispatch({type:"BACK_STATE",state:"base"})
        }} icon={<RiArrowLeftFill />} />
      <div className={`${styles.legendTitle} overflow-ellipsis flex-1 flex-center`}>
        {mapIcon && <img src={`/api/glyph?picker=true&w=20&icon=${mapIcon}`} width={24} height={24} style={{marginRight:8}}/>}
        <span>{pageTitle}</span>
      </div>
    </div>
    <div className={`${styles.legendSections} flex-1`} ref={legendScroll}>
    {mapData.map(l => {

      return <LegendSection key={l.id} layer={l} />;
    })}
    <div className={styles.addSection}>
    <Button icon={<RiSettingsLine />} onClick={()=>{updateSettingsOpen(true)}} className={styles.settingsIcon} modifiers={['sm','secondary','round',"icon"]}/>
    <Button icon={<RiStackLine/>} modifiers={["sm"]} className={styles.layerAddButton} onClick={(e)=>{
      e.preventDefault();
      layerDispatch({type:"ADDED_LAYER",user:user||null})
      legendScroll.current.scrollTop = legendScroll.current.scrollHeight + 500
      
      }} >Add a layer</Button>
    </div>
    </div>
    
 </>)}
  {settingsOpen && <Suspense fallback={<div style={{background:"var(--screen-bg)",position:"fixed",inset:0, zIndex:9999}} />}><MapEditingPanel closeFunction={()=>{updateSettingsOpen(false)}}/></Suspense>}

  </div>
}

export default Legend; 
