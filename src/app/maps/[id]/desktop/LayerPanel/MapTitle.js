import { useContext, useState,useRef ,useEffect} from "react";
import DataContext from "@/app/contexts/DataContext";

import styles from "./Header.module.css";

import TextInput from "@/app/components/TextInput";


const TitleEditForm = ({currentTitle,updateEditing}) => {
  const {updatePageTitle,mapId} = useContext(DataContext);

  const activeInput = useRef(null);
  const [tempData,updateTempData] = useState(currentTitle);
  const cancelEdit = () => {
    updateEditing(false);
  }
  const sendNewTitle = () => {
    updatePageTitle(tempData);

    updateEditing(false);
  }

  useEffect(()=> {
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

const MapTitle = ()=> {

  const [editing, updateEditing] = useState(false)
  const {pageTitle,mapIcon} = useContext(DataContext)
    
  return <>
  {!editing ? <div onClick={(e)=>{e.preventDefault(); updateEditing(true)}} className={`${styles.title} overflow-ellipsis flex-1`}>
        {pageTitle}
    </div> : <TitleEditForm currentTitle={pageTitle} updateEditing={updateEditing} /> }
  </>
}

export default MapTitle; 