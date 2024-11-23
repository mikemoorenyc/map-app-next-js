import Pin from '../../sharedComponents/Pin';
import { useEffect,useRef,useContext } from 'react';
import ActiveContext from '@/app/contexts/ActiveContext';

import styles from "./PinItem.module.css"
const PinItem = (props) => {
  const {p,isActive,isDragging,layer} = props;
  const {activeData,activeDispatch} = useContext(ActiveContext)

  const pinEl = useRef(null);
  useEffect(()=> {
        if(!pinEl) return ; 
        activeDispatch({type: "ADD_PIN_ITEM_REF", pinItemRef: {
            ref: pinEl.current, 
            id: p.id
        }})
  },[pinEl])
  const handleClick = (e) => {
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
    className={`${styles.pinItem} ${isDragging ? styles.isDragging : ""} ${isActive?styles.isActive:""}`}
  >
    <div style={{marginRight: 4}}>
      <Pin 
        pin={p}
        layer={layer}
        interactable={false}
        size={10}
      />
      </div>
      <div className='overflow-ellipsis' style={{cursor:"pointer", flex:1, textDecoration: p?.visited ? "line-through":""}}>
        {p.title}
      </div>
    
  </div>


}

export default PinItem