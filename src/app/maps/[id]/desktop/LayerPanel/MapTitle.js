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
  const {pageTitle} = useContext(DataContext)
  
  const activeInput = useRef(null)
  return <>
  {!editing ? <div onClick={(e)=>{e.preventDefault(); updateEditing(true)}} className={`${styles.title} overflow-ellipsis`}>
        {pageTitle}
    </div> : <TitleEditForm currentTitle={pageTitle} updateEditing={updateEditing} /> }
  </>
}

export default MapTitle; 