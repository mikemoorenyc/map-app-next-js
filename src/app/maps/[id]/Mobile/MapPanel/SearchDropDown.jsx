import { useContext } from "react";
import styles from "./MobileSearchStyles.module.css"
import DataContext from "@/app/contexts/DataContext";
import Pin from "../../sharedComponents/Pin";

import { RiMapPinLine } from "@remixicon/react";
const SearchItem = ({item,icon,itemClicked}) => {

    return <div onClick={()=>{itemClicked(item)}} className={`${styles.searchItem} flex-center`}>
      <div  className={`${styles.searchItemIcon} flex-center-center`}>{icon}</div>
      <div className={`${styles.searchItemTitle} `}><span className="overflow-ellipsis" style={{display:"block"}}  dangerouslySetInnerHTML={{__html:item.titleBolded}} /></div>
    </div>
  }
  
export default function({results,itemClicked}) {
  const {layerData} = useContext(DataContext);
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
        {activePins.map(p=> {
          const layer = layerData.find(l => l.id == p.layerId); 
        const icon = <Pin onMap={true} layer={layer} interactiable={false} size={13} pin={p} />
          return <SearchItem {...{itemClicked,icon}}  key={p.id} item={p} />
        })}
      
      </div>):""}
      {(activePins.length && predictions.length)? <hr className={styles.searchHR} /> :""}
      {predictions.length? (
        <div className={styles.pinContainer}>
        {predictions.map(p => {
         
          return <SearchItem itemClicked={itemClicked} key={p.id} icon={<RiMapPinLine />} item={p}/>
        })}
        </div>
      ):""}
      </div>
    </div>
  )

}
