import { useContext } from "react";
import styles from "./MobileSearchStyles.module.css"
import DataContext from "@/app/contexts/DataContext";
import Pin from "../../sharedComponents/Pin";
import { MapPin } from "iconoir-react";
export default function({results,itemClicked}) {
  const {layerData} = useContext(DataContext);
  const { predictions, activePins} = results; 

  const SearchItem = ({item,icon}) => {

    return <div onClick={()=>{itemClicked(item)}} className={`${styles.searchItem} flex-center`}>
      <div  className={`${styles.searchItemIcon} flex-center-center`}>{icon}</div>
      <div className={`${styles.searchItemTitle} `}><span className="overflow-ellipsis" style={{display:"block"}}  dangerouslySetInnerHTML={{__html:item.titleBolded}} /></div>
    </div>
  }
  
  
 

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
        const icon = <Pin layer={layer} interactiable={false} size={13} pin={p} />
          return <SearchItem icon={icon} key={p.id} item={p} />
        })}
      
      </div>):""}
      {(activePins.length && predictions.length)? <hr className={styles.searchHR} /> :""}
      {predictions.length? (
        <div className={styles.pinContainer}>
        {predictions.map(p => {
          return <SearchItem key={p.id} icon={<MapPin />} item={p}/>
        })}
        </div>
      ):""}
      </div>
    </div>
  )

}