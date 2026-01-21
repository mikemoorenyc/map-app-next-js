import Pin from '../../sharedComponents/Pin';
import { useEffect,useRef,useContext, SyntheticEvent } from 'react';
import ActiveContext from '@/app/contexts/ActiveContext';

type TProps = {
  p:TPin,
  isDragging:boolean,
  layer:TLayer
}

import styles from "./PinItem.module.css"
import { TLayer, TPin } from '@/projectTypes';
const PinItem = (props:TProps) => {
  const {p,isDragging,layer} = props;
  const {activeData,activeDispatch} = useContext(ActiveContext)

  const isActive = p.id == activeData.editingPin;
  const pinEl = useRef(null);
  useEffect(()=> {
        if(!pinEl) return ; 
        activeDispatch({type: "ADD_PIN_ITEM_REF", pinItemRef: {
            ref: pinEl.current, 
            id: p.id
        }})
  },[pinEl])
  const handleClick = (e:SyntheticEvent) => {
    e.preventDefault();
    if(activeData.editingPin == p.id) return ; 
      activeDispatch({
        type: "EDITING_PIN", 
        id: p.id,
        noViewScroll: true
    })
  }
  return <div
    onMouseEnter={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:p.id})}}
    onMouseLeave={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})}}
    ref={pinEl}
    onClick={handleClick}
    key={p.id}
    
    className={`${styles.pinItem} ${isDragging ? styles.isDragging : ""} ${isActive?styles.isActive:""} ${activeData.hoveringPin == p.id?styles.isHovering:""} ${p.favorited?styles.pinFavorited:""}`}
  >
    <div style={{marginRight: p.favorited?2: 6}}>
      <Pin 
        pin={p}
        layer={layer}
        interactable={false}
        size={16}
        onMap={true}
        className={`${styles.layerPin} ${p.favorited?styles.favorited:""}`}
      />
      </div>
      <div className='overflow-ellipsis' style={{cursor:"pointer", flex:1, textDecoration: p?.visited ? "line-through":""}}>
        {p.title}
      </div>
    
  </div>


}

export default PinItem