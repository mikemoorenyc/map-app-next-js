import Button from "@/app/components/Button";
import styles from "../../Mobile/DrawerPanel/EditPanel/EditPanel.module.css"

import { RiCloseLine, RiDeleteBinLine, RiSave3Line } from "@remixicon/react";

export default ({deleteFunction,cancelFunction,saveFunction}) => {
  return (
    <div className={`${styles.editPanelHeader} flex-center`}>
    <div className={`flex-1`}>
      <Button icon={<RiDeleteBinLine/>} modifiers={['ghost','caution',"sm"]} onClick={deleteFunction}>Delete</Button>
    </div>
    <Button icon={<RiCloseLine/>} modifiers={['secondary',"icon","round","sm"]} onClick={cancelFunction} />
    
    <div className={styles.saveButtonContainer}>
      <Button modifiers={["raised","big"]} icon={<RiSave3Line />} style={{marginLeft: 16}}  onClick={saveFunction}>Save</Button>
    </div>
  </div>
  )
}