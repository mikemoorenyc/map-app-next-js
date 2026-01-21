import { useContext, useState,useRef ,useEffect, SyntheticEvent} from "react";
import DataContext from "@/app/contexts/DataContext";

import styles from "./Header.module.css";

import TextInput from "@/app/components/TextInput";
import { useMyPresence } from "@liveblocks/react/suspense";
import useLiveEditing from "@/app/lib/useLiveEditing";
import { usePageTitle } from "@/app/lib/useLayerData";


const TitleEditForm = ({currentTitle,updateEditing}:{currentTitle:string,updateEditing:Function}) => {

  const dispatchEvent = useLiveEditing(); 
  const activeInput = useRef<HTMLInputElement>(null);
  const [tempData,updateTempData] = useState(currentTitle);
  const cancelEdit = () => {
    updateEditing(false);
  }
  const sendNewTitle = () => {
 
    dispatchEvent([{
      type: "UPDATE_TITLE",
      data: tempData
    }])
    updateEditing(false);
  }

  useEffect(()=> {
    if(!activeInput?.current) return ;
    activeInput.current.focus(); 
  },[])
  return <form
  className={`${styles.title} flex-1`}
    onSubmit={(e)=> {
      e.preventDefault(); 
      sendNewTitle() ; 
    }}
  
  >
  
  <TextInput
  style={{width: "100%"}}
  type={"text"}
  name={"title_input"}
  ref={activeInput}
  value={tempData}
  onChange={(e)=> {
    e.preventDefault();
    updateTempData(e.target.value)
  }}
  onBlur={cancelEdit}
  onKeyDown={(e)=> {
    if(e.key == "Escape") {
      cancelEdit(); 
    }
  }}


  />
  </form>
}

const MapTitle = ({canEdit}:{canEdit:boolean})=> {
  const [myPresence,updateMyPrescence] = useMyPresence(); 
  const [editing, updateEditing] = useState(false)
  const pageTitle = usePageTitle(); 
  if(!pageTitle) {
    return ;
  }
    
  return <>
  {!editing ? <div onClick={(e)=>{if(!canEdit) return false; e.preventDefault(); updateEditing(true); updateMyPrescence({isEditing:true})}} className={`${styles.title} ${styles.start} ${!canEdit?styles.disabled:""} overflow-ellipsis flex-1`}>
        {pageTitle}
    </div> : <TitleEditForm currentTitle={pageTitle} updateEditing={()=>{updateEditing(false);updateMyPrescence({isEditing:false})}} /> }
  </>
}

export default MapTitle; 