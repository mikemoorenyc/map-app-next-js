

import StringHighlight from "./StringHighlight";
import styles from "./styles.module.css"
import Pin from "@/app/maps/[id]/sharedComponents/Pin";
import { useContext,useState,useEffect } from "react";
import DataContext from "@/app/contexts/DataContext";

import { RiMapPinLine } from "@remixicon/react";


export default function DropDown({activePins=[],query,predictions=[],style="desktop",itemActivated,pinsFlat=[]}) {


  const {layerData} = useContext(DataContext);
  const [currentIndex,updateCurrentIndex] = useState(-1); 
 
  const [currentHover, updateCurrentHover] = useState(null);
  /*const predictionsFormatted = predictions.length? predictions.map(p=> {
    return {
      title: p.description, 
      id: p.place_id,
      new:true
    }
  }) : []; */ 
  /*const itemsFlat = [...activePins,...predictionsFormatted]; 
  useEffect(()=> {
    updateCurrentIndex(-1);
  },[predictions,activePins])*/

  useEffect(()=> {
    const checkKey = (e) => {

      switch (e.code) {
        case "ArrowUp":
   
          if(currentIndex === 0) {
            return ;
          }
          updateCurrentIndex(prev => {
            return prev - 1; 
          })
          break;
        case "ArrowDown" :
       
          if(currentIndex === pinsFlat.length - 1) {
            return 
          }
          updateCurrentIndex(prev => {
            return prev + 1; 
          })
          break; 
        case "Enter" : 
          const item = pinsFlat[currentIndex]; 
          itemActivated(item)
          break; 
      }
    }
    document.addEventListener("keydown",checkKey)
    return () => {
      document.removeEventListener("keydown",checkKey);
    }
  },[currentIndex])
  
 
  
  
  const SearchItem = ({p,icon}) => {
  
    const cIndex = pinsFlat.findIndex(item => item.id === p.id); 
    const active = cIndex == currentIndex;
    return (
      <div className={`${styles.SearchOption} flex-center ${active?styles.active:""}`}
      onClick={()=> {
        itemActivated(p)
      }}
  onMouseEnter={()=> {
    if(currentHover === cIndex) {
      return;
    }
    updateCurrentHover(cIndex);
    updateCurrentIndex(cIndex);
  }}
  >
    <span style={{marginRight:4}}>{icon}</span>
    <span className={`${styles.SearchTitle} flex-1 overflow-ellipsis`}><span
      dangerouslySetInnerHTML={{__html: p.titleBolded}}
     /></span>
  </div>
    )
  }

  return <div className={`${styles.DropDown} big-drop-shadow `}>
    {activePins.length? <div className={styles.OptionContainer}>
      {activePins.map(p=>{
        const layer = layerData.find(l => l.id == p.layerId); 
        const icon = <Pin className={styles.pinSmall} onMap={true} interactiable={false} size={10} pin={p} layer={layer}/>
        return <SearchItem key={p.id} p={p} icon={icon}/>
      })}
    
    </div>:""}
    {(predictions.length && activePins.length) ? <hr style={{margin:0}}/>:""}
    {predictions.length ? <div className={styles.OptionContainer}>
      {predictions.map(p => {
        return <SearchItem key={p.id} p={p} icon={<RiMapPinLine width={18} height={18}/>}/>
      })}
    </div> : ""}
  
  </div>
}
