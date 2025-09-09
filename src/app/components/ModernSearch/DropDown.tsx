

import styles from "./styles.module.css"
import Pin from "@/app/maps/[id]/sharedComponents/Pin";
import { ReactNode,useState,useEffect, useCallback } from "react";

import { memo ,useMemo} from "react";
import { RiMapPinLine } from "@remixicon/react";
import { TLayer ,TPin} from "@/projectTypes";
import useLayerData from "@/app/lib/useLayerData";
import { TPredictionResult } from "./lib/resultFormatter";


type TProps = {
  itemActivated:Function,
  pinsFlat: (TPredictionResult|TPin)[],
  predictions: TPredictionResult[],
  activePins: TPredictionResult[]
}

const PinMemo = memo(Pin)
const DropDownWrapper = (props:TProps) => {

  const getLayerData = useLayerData(); 

  const layerData = getLayerData.layers
  const {findPin} = getLayerData
 
  const newProps = {...props, ...{layerData,findPin}};
  return <DropdDownMemo {...newProps} />


}


const DropDown = (props: TProps & {layerData:TLayer[],findPin:(id:number|string)=>TPin}) =>{
  const {activePins=[],predictions=[],itemActivated,pinsFlat=[],layerData,findPin} = props;


  const [currentIndex,updateCurrentIndex] = useState(-1); 
 
  const [currentHover, updateCurrentHover] = useState<number|null>(null);
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
    const checkKey = (e:KeyboardEvent) => {

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
        const pin = findPin(p.id);

        return <SearchMemo key={p.id}
        {...{...itemActions,...{

          icon: <PredictionPin {...{p:pin,layerData}}  />,
          cIndex: pinsFlat.findIndex(item => item.id === p.id),
          active: pinsFlat.findIndex(item => item.id === p.id) === currentIndex,
          currentHover, p,title:p.title
        }}}
   
        />
      })}
    
    </div>:""}
    
    {(predictionsFiltered.length && activePins.length) ? <hr style={{margin:0}}/>:""}
    {predictionsFiltered.length ? <div className={styles.OptionContainer}>
      {predictionsFiltered.map(p => {
      
        return <SearchMemo key={p.id} {...{...itemActions,...{
          icon: <RiMapPinLine size={18}/>,
          cIndex: pinsFlat.findIndex(item => item.id === p.id),
          active: pinsFlat.findIndex(item => item.id === p.id) === currentIndex,
          currentHover, p,
          title:p.titleBolded
        }}}/>
      })}
    </div> : ""}
  
  </div>
}
const PredictionPin = memo(({layerData,p}:{layerData:TLayer[],p:TPin})=> {
  const layer = layerData.find(l => l.id == p.layerId); 
  if(!layer) return false; 
  return <PinMemo className={`${styles.pinSmall} ${p.favorited?styles.favorited:""}`} onMap={true} interactable={false} size={16} pin={p} layer={layer}/>
}) 

const SearchMemo = memo(({icon,p,cIndex,active,itemActivated,updateCurrentHover,updateCurrentIndex,currentHover,title}:{
  icon:ReactNode,
  p:TPin|TPredictionResult,
  cIndex: number,
  active:boolean,
  itemActivated:Function, 
  updateCurrentHover: Function, 
  updateCurrentIndex:Function, 
  currentHover: number|null,
  title: string
})=> {
 
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
      dangerouslySetInnerHTML={{__html: title}}
     /></span>
  </div>
    )
})

const DropdDownMemo = memo(DropDown)

export default DropDownWrapper; 

