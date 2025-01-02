import Button from "@/app/components/Button";
import styles from "./MoverStyles.module.css"
import { useContext } from "react";
import { NavArrowDown, NavArrowUp } from "iconoir-react";
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
  return <></>
  return <div className="display-flex">
  <Button onClick={(e)=> {
    e.preventDefault(); 
    moveItem(false)
  }} style={idIndex == arraySet.length - 1?disabledStyles:{}} icon={<NavArrowDown />} className={`${styles.moverButton}`}>Move Down</Button>
  <Button onClick={(e)=> {
    e.preventDefault(); 
    moveItem(true)
  }} style={idIndex === 0 ?disabledStyles:{}} icon={<NavArrowUp/>} className={`${styles.moverButton}`}>MoveUp</Button>
  </div>
}