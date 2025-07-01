

import styles from "./styles.module.css"
import Pin from "@/app/maps/[id]/sharedComponents/Pin";
import { useContext,useState,useEffect, useCallback } from "react";
import DataContext from "@/app/contexts/DataContext";
import { memo ,useMemo} from "react";
import { RiMapPinLine } from "@remixicon/react";

const PinMemo = memo(Pin)
const DropDownWrapper = (props) => {

  const {layerData} = useContext(DataContext);
  const newProps = {...props, layerData};
  return <DropdDownMemo {...newProps} />


}


const DropDown = (props) =>{
  const {activePins=[],query,predictions=[],style="desktop",itemActivated,pinsFlat=[],layerData} = props;


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
  
 
  
  


  const itemActions = {updateCurrentHover,updateCurrentIndex,itemActivated};
  
  const pinIds = useMemo(()=>activePins.map(p => p.id),[activePins]);
  const predictionsFiltered = predictions.filter(p => {
    if(!activePins.length) return true; 
     
    return !pinIds.includes(p.id); 
  });
  



  return <div className={`${styles.DropDown} big-drop-shadow `}>
    {activePins.length? <div className={styles.OptionContainer}>
      {activePins.map(p=>{

        return <SearchMemo key={p.id}
        {...{...itemActions,...{

          icon: <PredictionPin {...{p,layerData}}  />,
          cIndex: pinsFlat.findIndex(item => item.id === p.id),
          active: pinsFlat.findIndex(item => item.id === p.id) === currentIndex,
          currentHover, p
        }}}
   
        />
      })}
    
    </div>:""}
    
    {(predictionsFiltered.length && activePins.length) ? <hr style={{margin:0}}/>:""}
    {predictionsFiltered.length ? <div className={styles.OptionContainer}>
      {predictionsFiltered.map(p => {
      
        return <SearchMemo key={p.id} {...{...itemActions,...{
          icon: <RiMapPinLine width={18} height={18}/>,
          cIndex: pinsFlat.findIndex(item => item.id === p.id),
          active: pinsFlat.findIndex(item => item.id === p.id) === currentIndex,
          currentHover, p
        }}}/>
      })}
    </div> : ""}
  
  </div>
}
const PredictionPin = memo(({layerData,p})=> {
  const layer = layerData.find(l => l.id == p.layerId); 
  return <PinMemo className={styles.pinSmall} onMap={true} interactiable={false} size={10} pin={p} layer={layer}/>
}) 

const SearchMemo = memo(({icon,p,cIndex,active,itemActivated,updateCurrentHover,updateCurrentIndex,currentHover})=> {
 
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
})

const DropdDownMemo = memo(DropDown)

export default DropDownWrapper; 
