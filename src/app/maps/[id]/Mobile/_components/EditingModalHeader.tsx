import Button, { TModOptions } from "@/_components/Button";
import styles from "../../Mobile/DrawerPanel/EditPanel/EditPanel.module.css"

import { RiCloseLine,  RiSave3Line } from "@remixicon/react";
import { SyntheticEvent } from "react";

type TProps = {
  cancelFunction:(e:SyntheticEvent)=>void, 
  saveFunction?: (e:SyntheticEvent) => void
}

export default ({cancelFunction,saveFunction}:TProps) => {
  const btnMods:TModOptions[] = ["icon","round"];
  if(!saveFunction) {
    btnMods.push("disabled")
  }
  return (
    <div className={`${styles.editPanelHeader} flex-center`}>

    <Button icon={<RiCloseLine/>} modifiers={['ghost',"icon","round","sm"]} onClick={cancelFunction} />
    
     <div className={styles.saveButtonContainer}>
      <Button modifiers={btnMods} icon={<RiSave3Line />} style={{marginLeft: 16}}  onClick={saveFunction} />
    </div>
  </div>
  )
}


/*
    <div className={`flex-1`}>
      <Button icon={<RiDeleteBinLine/>} modifiers={['ghost','caution',"sm"]} onClick={deleteFunction}>Delete</Button>
    </div>
    */