import Button from "@/app/components/Button";
import styles from "../../Mobile/DrawerPanel/EditPanel/EditPanel.module.css"

import { RiCloseLine,  RiSave3Line } from "@remixicon/react";

export default ({deleteFunction,cancelFunction,saveFunction}) => {
  return (
    <div className={`${styles.editPanelHeader} flex-center`}>

    <Button icon={<RiCloseLine/>} modifiers={['ghost',"icon","round","sm"]} onClick={cancelFunction} />
    
     <div className={styles.saveButtonContainer}>
      <Button modifiers={["icon","round", !saveFunction?"disabled":""]} icon={<RiSave3Line />} style={{marginLeft: 16}}  onClick={saveFunction} />
    </div>
  </div>
  )
}


/*
    <div className={`flex-1`}>
      <Button icon={<RiDeleteBinLine/>} modifiers={['ghost','caution',"sm"]} onClick={deleteFunction}>Delete</Button>
    </div>
    */