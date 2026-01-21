
import styles from "./MobileSearchStyles.module.css"

import Pin from "../../sharedComponents/Pin";

import { RiMapPinLine } from "@remixicon/react";



import { TPredictionResult } from "@/app/components/ModernSearch/lib/resultFormatter";
import { ReactNode } from "react";
import { useFindLayer, useFindPin, useLayers } from "@/app/lib/useLayerData";
type PredictionClick = (i:TPredictionResult) => void
type ItemProps = {
  item:TPredictionResult,
  icon:ReactNode,
  itemClicked:PredictionClick
}
const SearchItem = ({item,icon,itemClicked}:ItemProps) => {

    return <div onClick={()=>{itemClicked(item)}} className={`${styles.searchItem} flex-center`}>
      <div  className={`${styles.searchItemIcon} flex-center-center`}>{icon}</div>
      <div className={`${styles.searchItemTitle} `}><span className="overflow-ellipsis" style={{display:"block"}}  dangerouslySetInnerHTML={{__html:item.titleBolded}} /></div>
    </div>
  }
  
export default function({results,itemClicked}:{
  results: {
    activePins: TPredictionResult[],
    predictions: TPredictionResult[],
    
  };
  itemClicked :PredictionClick
}) {
  const layerData = useLayers();
  const { activePins=[],predictions=[]} = results; 


  return (
    <div className={styles.pinOuter}
      style={{
        height: `calc(var(--view-port-size) - 34px - 24px)`
      }}
    >
      <div 
        style={{
          minHeight: `calc(100% + 5px)`,
      
        }}
      className="scroll-mover">
      {activePins.length ? (<div className={styles.pinContainer}>
        {activePins.map((p:TPredictionResult)=><ActivePinResult {...{p,itemClicked}} key={p.id}/>)}
      
      </div>):""}
      {(activePins.length && predictions.length)? <hr className={styles.searchHR} /> :""}
      {predictions.length? (
        <div className={styles.pinContainer}>
        {predictions.map((p:TPredictionResult) => {
         
          return <SearchItem itemClicked={itemClicked} key={p.id} icon={<RiMapPinLine />} item={p}/>
        })}
        </div>
      ):""}
      </div>
    </div>
  )

}

const ActivePinResult = ({p,itemClicked}:{p:TPredictionResult,itemClicked:PredictionClick}) => {
  const pin = useFindPin(p.id); 
  const layer = useFindLayer(pin?.layerId||-1)
  if(!pin || !layer) return ;
   const icon = <Pin onMap={true} layer={layer} interactable={false} size={14} className={`${styles.searchDropDownPin} ${pin.favorited? styles.favorited:""}`} pin={pin} />
          return <SearchItem {...{itemClicked,icon}}  key={pin.id} item={p} />

}