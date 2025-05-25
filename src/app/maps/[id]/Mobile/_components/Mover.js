import Button from "@/app/components/Button";
import styles from "./MoverStyles.module.css"
import { useContext } from "react";

import { RiArrowDownSLine , RiArrowUpSLine} from "@remixicon/react"
import DataContext from "@/app/contexts/DataContext";
export default function Mover({arraySet,id,arrayId,type})  {
  const {layerDispatch} = useContext(DataContext)
  const idIndex = arraySet.findIndex(a => a.id == id);
  const disabledStyles = {
    pointerEvents: "none",
    opacity: .5
  }
  const moveItem = (goingUp) => {
    layerDispatch({
      type: "MOVE_ITEM",
      itemType : type, 
      arrayId: arrayId,
      itemId: id,
      goingUp: goingUp,
      currentIndex: idIndex
    })
  } 

  return <div className="display-flex">
  <Button modifiers={["secondary",idIndex == arraySet.length - 1?"disabled":""]} onClick={(e)=> {
    e.preventDefault(); 
    moveItem(false)
  }} icon={<RiArrowDownSLine />} className={`${styles.moverButton}`}>Move Down</Button>
  <Button modifiers={["secondary",idIndex === 0?"disabled":""]} onClick={(e)=> {
    e.preventDefault(); 
    moveItem(true)
  }} icon={<RiArrowUpSLine/>} className={`${styles.moverButton}`}>MoveUp</Button>
  </div>
}