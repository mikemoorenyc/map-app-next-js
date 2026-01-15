import  { useContext ,useRef,useState,Suspense,lazy} from "react"

import MobileActiveContext from "@/_contexts/MobileActiveContext"
import LegendSection from "./LegendSection"
import svgImgUrl from "@/_lib/svgImgUrl"
import Button from "@/_components/Button"
import DataContext from "@/_contexts/DataContext"
import styles from "./styles.module.css";
import { RiArrowLeftFill,  RiSettingsLine,  } from "@remixicon/react"
import AddLayerButton from "./AddLayerButton"
import addDisabledMod from "@/_lib/addDisabledMod"

import useLayerData from "@/_lib/useLayerData"

const MapEditingPanel = lazy(()=>import("./MapEditingPanel"))

const Legend = () => {
  const {activeData, activeDispatch} = useContext(MobileActiveContext)
  

  //const mapData = layerData
  const {canEdit} = activeData
  const legendIsOpen = activeData?.legendOpen && activeData?.drawerState != "editing" 
  const legendScroll = useRef(null);
  const [settingsOpen,updateSettingsOpen] = useState(false);
  const {mapIcon,pageTitle,layers} = useLayerData();
  
  return <div className={`${styles.legend} ${legendIsOpen ? styles.open : ""}`}>
  {legendIsOpen && (<>
    <div className={`${styles.legendHeader} flex-center`}>
      
      
      <Button className={styles.legendHeaderButton} modifiers={["ghost","secondary","icon","round"]} onClick={(e)=>{
        e.preventDefault(); 
        activeDispatch({type:"LEGEND_OPEN",state:false})
        activeDispatch({type:"BACK_STATE",state:"base"})
        }} icon={<RiArrowLeftFill />} />
      <div className={`${styles.legendTitle} overflow-ellipsis flex-1 flex-center`}>
        {mapIcon && <img src={svgImgUrl({icon:mapIcon,picker:true})} width={24} height={24} style={{marginRight:8}}/>}
        <span>{pageTitle}</span>
      </div>
    </div>
    <div className={`${styles.legendSections} flex-1`} ref={legendScroll}>
    {layers.map(l => {

      return <LegendSection key={l.id} layer={l} />;
    })}
    <div className={styles.addSection}>
    <Button icon={<RiSettingsLine />} onClick={()=>{updateSettingsOpen(true)}} className={styles.settingsIcon} modifiers={addDisabledMod(['sm','secondary','round',"icon"],!canEdit)}/>
    <AddLayerButton {...{legendScroll}}/>
    </div>
    </div>
    
 </>)}
  {settingsOpen && <Suspense fallback={<div style={{background:"var(--screen-bg)",position:"fixed",inset:0, zIndex:9999}} />}><MapEditingPanel closeFunction={()=>{updateSettingsOpen(false)}}/></Suspense>}

  </div>
}

export default Legend; 
