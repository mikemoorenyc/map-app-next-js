import Pin from '../../../../../_components/Pin';
import { useEffect,useRef,useContext, SyntheticEvent } from 'react';


type TProps = {
  p:TPin,
  isDragging:boolean,
  layer:TLayer
}

import styles from "./PinItem.module.css"
import { TLayer, TPin } from '@/projectTypes';
import useActiveStore from '@/_contexts/useActiveStore';

const PinItem = (props:TProps) => {
  const {p,isDragging,layer} = props;
  const editingPin = useActiveStore(s=>s.editingPin)
  const addPinItemRef = useActiveStore(s=>s.addPinItemRefs);
  const updateEditingPin = useActiveStore(s=>s.updateEditingPin)
  const hoveringPin = useActiveStore(s=>s.hovering)
  const updateHoveringPin = useActiveStore(s=>s.updateHovering)

  const isActive = p.id == editingPin;
  const pinEl = useRef<null|HTMLDivElement>(null);
  useEffect(()=> {
    if(!pinEl || !pinEl.current) return ; 
    addPinItemRef({
      ref: pinEl.current, 
      id: p.id
    })

    const listenEvent = (event:CustomEvent) => {
      const {id} = event.detail
      if(id !== p.id) return ;
      if(!pinEl || !pinEl.current) return ; 
      pinEl.current.scrollIntoView({block:"center"});

    }
    window.addEventListener("pinClicked",listenEvent);
    return () => {
      window.removeEventListener("pinClicked",listenEvent)
    }
 
  },[pinEl])
  
  const handleClick = (e:SyntheticEvent) => {
    e.preventDefault();
    if(editingPin == p.id) return ; 
      updateEditingPin(p.id);

  }
  return <div
    onMouseEnter={()=>{
   
      updateHoveringPin(p.id)
    }}
    onMouseLeave={()=>{
  
      updateHoveringPin(null)
    }}
    ref={pinEl}
    onClick={handleClick}
    key={p.id}
    
    className={`${styles.pinItem} ${isDragging ? styles.isDragging : ""} ${isActive?styles.isActive:""} ${hoveringPin == p.id?styles.isHovering:""} ${p.favorited?styles.pinFavorited:""}`}
  >
    <div style={{marginRight: p.favorited?1: 4}}>
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