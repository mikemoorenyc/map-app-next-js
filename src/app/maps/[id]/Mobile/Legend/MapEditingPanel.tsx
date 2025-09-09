import { createPortal } from "react-dom";
import TextField from "../DrawerPanel/EditPanel/TextField";
import ChangeIcon from "../DrawerPanel/EditPanel/ChangeIcon";
import EditingModalHeader from "../_components/EditingModalHeader";
import styles from "./styles.module.css"
import { useState, useContext, useEffect, SyntheticEvent } from "react";
import DataContext from "@/app/contexts/DataContext";
import editorStyles from "../DrawerPanel/EditPanel/EditPanel.module.css"
import { useMyPresence,ClientSideSuspense } from "@liveblocks/react";
import useLiveEditing from "@/app/lib/useLiveEditing";
import ModalLoading from "../_components/ModalLoading";
import PortalContainer from "@/app/components/PortalContainer/PortalContainer";
type Props = {closeFunction:()=>void}
function MapEditingPanel({closeFunction}:Props)  {
  const {pageTitle,mapIcon} = useContext(DataContext)
  const [tempTitle,updateTempTitle] = useState(pageTitle)
  const [tempIcon,updateTempIcon] = useState(mapIcon);
  const [saveDisabled,updateSavedDisabled] = useState(false)
  const dispatchEvent = useLiveEditing(); 

  const saveData = (e:SyntheticEvent) => {
    dispatchEvent({
      type:"UPDATE_TITLE",
      data: tempTitle
    })
    if(tempIcon) {
      dispatchEvent({
      type:"UPDATE_MAP_ICON",
      data: tempIcon
    })
    }

    closeFunction(); 
  }
  const [myPresence,updateMyPresence] = useMyPresence(); 
  useEffect(()=> {
    updateMyPresence({isEditing:true})
    return () => {
      updateMyPresence({isEditing:false})
    }
  },[]) 

  return <>
  <PortalContainer>
    <div className={styles.editingSection}>
      <EditingModalHeader 
        cancelFunction={()=>{closeFunction()}}
        saveFunction={!saveDisabled ? saveData : undefined}
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
        <TextField name="icon">
            <ChangeIcon type={"layer"} currentIcon={tempIcon} valueChanger={(icon)=>{updateTempIcon(icon)}} />
        </TextField>
      
      </div>
    
    </div>
    </PortalContainer>
  
  </>

}
export default (props:Props) => <ClientSideSuspense fallback={<ModalLoading/>}><MapEditingPanel {...props}/></ClientSideSuspense>