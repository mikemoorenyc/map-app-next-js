import { useContext, useState , useRef, useEffect} from "react";
import DataContext from "@/app/contexts/DataContext";
import ToastContext from "@/app/contexts/ToastContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import LocationDetails from "@/app/components/LocationDetails";

import IconSelector from "./IconSelector";
import InfoWindowHeader from "./InfoWindowHeader";
import Button from "@/app/components/Button";
import Linkify from 'linkify-react';

import styles from "./styles.module.css";


import {  CheckCircle, CheckCircleSolid, EditPencil, Emoji, Star, StarSolid, Trash } from "iconoir-react";

export default ({pinsFlat, pId,lId}) => {
  const {layerData,layerDispatch} = useContext(DataContext);
 
  const [iconSelectorOpen,updateIconSelectorOpen] = useState(false)
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const {infoWindowDispatch} = useContext(InfoWindowContext)
  const [editingText, updateEditingText] = useState(false);
  const {toastDispatch} = useContext(ToastContext)
  const [tempDeletedPin,updateTempDeletedPin] = useState(null);


const p = layerData.map(l => l.pins).flat().find(p=>p.id == activeData.editingPin);
if(!p) return ; 
const [tempData, updateTempData] = useState(p);
useEffect(()=> {
  console.log("update");
  updateTempData(p);
},[p])

  const currentLayer =layerData.filter(layer => {
    return layer.id == p.layerId;
  })[0]

  const pinIndex = currentLayer.pins.findIndex(pin => pin.id == p.id);




 

  const updateTempValue = (newValues) => {

    updateTempData(prev => {

        return {...prev, ...newValues}
    })
  }
  const cancelEditing = (e) => {
    updateEditingText(false);
    updateTempData(p);
  }

  const saveEditing = () => {

    layerDispatch({
      type: "UPDATED_PIN",
      id: p.id,
      data : {
        title : tempData.title,
        description: tempData.description
      }
    })
    updateEditingText(false)

  }



  const updateValue = (value,key) => {
    const payload = {};
    payload[key] = value 
    layerDispatch({
      type: "UPDATED_PIN",
      id: p.id,
      data: payload
    })
  }

  //DELETING THINGS


  const undoPinDelete = () => {
    console.log("click");
    layerDispatch({
      type: "SPLICED_PIN",
      pin: p,
      spliceIndex: pinIndex
    })
    toastDispatch({
      type: "REMOVE_TOAST",
      id: p.id
    })
  }
  
  const deletePin = () => {
    toastDispatch({type: "ADD_TOAST", toast: {
      id: p.id, 
      content: <div className="flex-center">
        <span style={{margin: "0 3px 4px"}} >Deleted {p.title} </span >
        <button onClick={(e)=>{e.preventDefault(); undoPinDelete();}} style={{textDecoration: "underline"}}>Undo</button></div>,
     
    }})

    updateTempDeletedPin(p);

    
    infoWindowDispatch({type:"CLOSE_WINDOW"})
    activeDispatch({
      type: "EDITING_PIN",
      id: null
    })
    layerDispatch({
      type: "DELETED_PIN",
      id: p.id,
      layerId: layerData.filter(layer => layer.id == p.layerId)[0].id
    })
    
  }

  

  

  const pickerContainer = useRef(null);
  


  const keyPressSave = (e) => {
    const metas = ["altKey","shiftKey","ctrlKey","metaKey"];
    if(e.key != "Enter") return; 
    if(metas.filter(k => e[k] == true).length > 0) return; 
    saveEditing(); 
  }

  return  <>

  
  <InfoWindowHeader>
  {!editingText && p.title}
  {editingText && <input className={styles.titleInput} tabIndex={1} type="text" value={tempData.title} onKeyDown={keyPressSave} onChange={(e)=>{e.preventDefault(); updateTempValue({title:e.target.value})}}/>}

  </InfoWindowHeader>
  
  <div className="PinDisplay-container">
    {!editingText&&<div className={styles.displayDescription}>
    <Linkify options={{target: '_blank'}}>{p?.description}</Linkify>
    </div>}
  
    {editingText && <textarea className={styles.displayDescriptionInput} tabIndex={2} onKeyDown={keyPressSave} value={tempData.description ||""} onChange={(e) => {e.preventDefault(); updateTempValue({description: e.target.value})}} />}
    <LocationDetails placeData={p} />

  </div>
  <div className={styles.controls}>
    {!editingText&&<div className={`${styles.controlsDefault} display-flex`}>
        <div className="flex-center">
        <div ref={pickerContainer} style={{position:"relative",cursor: "pointer"}} className={styles.controlContainer} onClick={(e)=>{updateIconSelectorOpen(true)}}>
          {p.icon? <div style={{fontSize: 16}} className={"pin-icon"}>{p.icon}</div> :<Emoji />}
        </div>
        {iconSelectorOpen && <IconSelector id={p.id} updateValue={updateValue} pickerAnchor={pickerContainer.current.getBoundingClientRect()} updateIconSelectorOpen={()=>{updateIconSelectorOpen(false)}}  />}
        <button onClick={()=>{updateValue(p?.favorited ? false : true,"favorited")}} style={{marginRight:6}}>
            {p.favorited ? <StarSolid /> : <Star />}
          </button>
          <button onClick={()=>{updateValue(p?.visited ? false : true,"visited")}}>{!p?.visited ? <CheckCircle />:<CheckCircleSolid />}</button>



        </div>
        <div className="flex-center">
            <button style={{marginRight:4}} onClick={(e)=>{e.preventDefault();updateEditingText(true)}}><EditPencil /></button><br/>
            <button onClick={(e)=>{deletePin()}}><Trash /></button>

        </div>
    </div>
    }
    {editingText && <div className={`${styles.controlsDefault} display-flex`} style={{justifyContent:"flex-start"}}>
    <Button style={{marginRight:6, width:80}}  onClick={(e)=>{e.preventDefault(); saveEditing()}} >Save</Button>
      <Button style={{}} modifiers={["secondary"]} onClick={cancelEditing} >Cancel</Button>
      
    
    </div>}
  
  </div>


  
  

  

  


  </>
}


