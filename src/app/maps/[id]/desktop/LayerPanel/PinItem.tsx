import Pin from '../../sharedComponents/Pin';
import { useEffect,useRef,useContext, SyntheticEvent, memo } from 'react';
import ActiveContext from '@/app/contexts/ActiveContext';
import {useSortable} from '@dnd-kit/react/sortable';
type TProps = {
  p:TPin,
  isDragging:boolean,
  layer: TLayer,
  index: number,
}

import styles from "./PinItem.module.css"
import { TLayer, TPin } from '@/projectTypes';
const PinItem = (props:TProps&{editingPin:number|string|null,isHovering:boolean,activeDispatch:Function}) => {
  const {p,layer,index,activeDispatch,editingPin,isHovering} = props;
  const isActive = p.id == editingPin;
  const pinEl = useRef<null|HTMLElement>(null);
  useEffect(()=> {
        if(!pinEl || !pinEl.current) return ;
        activeDispatch({type: "ADD_PIN_ITEM_REF", pinItemRef: {
            ref: pinEl.current,
            id: p.id
        }})
  },[pinEl])
  const handleClick = (e:SyntheticEvent) => {
    e.preventDefault();
    if(editingPin == p.id) return ;
      activeDispatch({
        type: "EDITING_PIN",
        id: p.id,
        noViewScroll: true
    })
  }
  const {ref:dragRef, isDragging} = useSortable({
      id:p.id,
      index,
      type: 'pin',
      accept: 'pin',
      group: layer.id
    });
  useEffect(() => {
    if (isDragging) {
        activeDispatch({
          type: "EDITING_PIN",
          id: p.id,
          noViewScroll: true
        })
    }
  },[isDragging])
  return <div
    onMouseEnter={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:p.id})}}
    onMouseLeave={()=>{activeDispatch({type:"UPDATE_HOVERING_PIN",id:null})}}
    ref={(el)=> {dragRef(el); pinEl.current=el;}}
    onClick={handleClick}
    key={p.id}

    className={`${styles.pinItem} ${isDragging ? styles.isDragging : ""} ${isActive?styles.isActive:""} ${isHovering?styles.isHovering:""} ${p.favorited?styles.pinFavorited:""}`}
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
const PinItemMemo = memo(PinItem)
export default function (props: TProps) {
  const { p } = props;
  const { activeData, activeDispatch } = useContext(ActiveContext);
  const { hoveringPin, editingPin } = activeData
  const isHovering = p.id == hoveringPin;
  return <PinItemMemo {...props} editingPin={editingPin} isHovering={isHovering} activeDispatch={activeDispatch} />
}
