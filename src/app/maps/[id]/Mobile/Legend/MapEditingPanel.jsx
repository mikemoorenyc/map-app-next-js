import { createPortal } from "react-dom";
import TextField from "../DrawerPanel/EditPanel/TextField";
import ChangeIcon from "../DrawerPanel/EditPanel/ChangeIcon";
import EditingModalHeader from "../_components/EditingModalHeader";
import styles from "./styles.module.css"
import { useState, useContext } from "react";
import DataContext from "@/app/contexts/DataContext";
import editorStyles from "../DrawerPanel/EditPanel/EditPanel.module.css"

export default function ({closeFunction})  {
  const {pageTitle,mapIcon,updatePageTitle,updateMapIcon} = useContext(DataContext)
  const [tempTitle,updateTempTitle] = useState(pageTitle)
  const [tempIcon,updateTempIcon] = useState(mapIcon);
  const [saveDisabled,updateSavedDisabled] = useState(false)

  const saveData = () => {
    updatePageTitle(tempTitle);
    updateMapIcon(tempIcon);
    closeFunction(); 
  }

  return <>
  {createPortal(
    <div className={styles.editingSection}>
      <EditingModalHeader 
        cancelFunction={()=>{closeFunction()}}
        saveFunction={!saveDisabled ? saveData : null}
      />
      <div className={styles.editingBody}>
        <TextField name={"title"} label={"Map name"}>
        <input 
            onFocus={(e)=> {
                  if(tempTitle == "Untitled map") {
                    e.target.select(); 
                  }
                }}
            className={editorStyles.textFieldInput}
              onChange={(e)=> {
                e.preventDefault(); 
                updateTempTitle(e.target.value);
                if(!e.target.value.length) {
                  updateSavedDisabled(true);
                } else {
                  updateSavedDisabled(false);
                }
              }}
              value={tempTitle}
              type="text"
              name="title"
              id="title"
            />
            <div className={styles.disabledText} style={{visibility:saveDisabled?"visible":"hidden"}}>Map has to have a name</div>
        </TextField>
        <TextField>
            <ChangeIcon currentIcon={tempIcon} valueChanger={(icon)=>{updateTempIcon(icon)}} type={"layer"}/>
        </TextField>
      
      </div>
    
    </div>
    ,document.getElementById("portal-container"))}
  
  </>

}