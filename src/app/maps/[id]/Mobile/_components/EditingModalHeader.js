import Button from "@/app/components/Button";
import styles from "../../Mobile/DrawerPanel/EditPanel/EditPanel.module.css"
import { FloppyDisk,BinMinusIn,Xmark } from "iconoir-react";

export default ({deleteFunction,cancelFunction,saveFunction}) => {
  return (
    <div className={`${styles.editPanelHeader} flex-center`}>
    <div className={`flex-1`}>
      <Button icon={<BinMinusIn/>} modifiers={['ghost','caution']} onClick={deleteFunction}>Delete</Button>
    </div>
    <Button icon={<Xmark/>} modifiers={['secondary']} onClick={cancelFunction}>Cancel</Button>
    <Button icon={<FloppyDisk />} style={{marginLeft: 16}} modifiers={[]} onClick={saveFunction}>Save</Button>
  </div>
  )
}