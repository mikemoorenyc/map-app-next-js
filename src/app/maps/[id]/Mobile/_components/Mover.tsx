import Button, { TModOptions } from "@/app/components/Button";
import styles from "./MoverStyles.module.css"
import { } from "@/projectTypes";
import { RiArrowDownSLine , RiArrowUpSLine} from "@remixicon/react"
import { TPin,TLayer  } from "@/projectTypes";

type TProps={
  itemArrayLength:number,
  itemIndex:number,
  updateIndex: (i:number) =>void
}

export default function Mover({itemIndex,itemArrayLength,updateIndex}:TProps)  {
  console.log(itemIndex);
  console.log(itemArrayLength);

  const btnMods =(disabledCheck:boolean) : TModOptions[] => {
    const mods :TModOptions[]= ["secondary"];
    if(disabledCheck) {
      mods.push("disabled")
    }
    return mods; 
  }

  

  return <div className="display-flex">
  <Button modifiers={btnMods(itemIndex === itemArrayLength - 1)} onClick={(e)=> {
    e.preventDefault(); 
    updateIndex(1);
  }} icon={<RiArrowDownSLine />} className={`${styles.moverButton}`}>Move Down</Button>
  <Button modifiers={btnMods(itemIndex === 0)} onClick={(e)=> {
    e.preventDefault(); 
    updateIndex(-1);
  }} icon={<RiArrowUpSLine/>} className={`${styles.moverButton}`}>MoveUp</Button>
  </div>
}