
import styles from "./EditPanel.module.css"

import { useContext,useState,useMemo,useCallback, useEffect} from "react"
import DataContext from "@/app/contexts/DataContext"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import TextField from "./TextField"
import LayerSelector from "./LayerSelector"
import ChangeIcon from "./ChangeIcon"

import Switch from "./Switch"
import { createPortal } from "react-dom"
import DeleteModal from "../../_components/DeleteModal"
import EditingModalHeader from "../../_components/EditingModalHeader"
import Mover from "../../_components/Mover"
import Button from "@/app/components/Button"
import { RiDeleteBinLine } from "@remixicon/react"
import { ClientSideSuspense,useMyPresence } from "@liveblocks/react"
import useLiveEditing from "@/app/lib/useLiveEditing"
import ModalLoading from "../../_components/ModalLoading"
import useLayerData from "@/app/lib/useLayerData"

 function EditPanel() {
  const dispatchEvent = useLiveEditing() ; 
  const {layerData,} = useContext(DataContext);
  const {activeData,activeDispatch} = useContext(MobileActiveContext);
  const {activePin} = activeData;
  const {findPin,findLayer} = useLayerData(); 
  const pinData = findPin(activePin);
  //const pinData = useMemo(()=>layerData.map(l => l.pins).flat().find(p => p.id == activePin),[layerData,activePin]);
  const [myPresence,updateMyPrescence] = useMyPresence();

  useEffect(()=> {
    updateMyPrescence({isEditing:true});
    return () => {
      updateMyPrescence({isEditing:false});
    }
  },[])
  
  

  const [pinState,updatePinState] = useState(pinData);
  const [deletePending, updateDeletePending] = useState(false)
 
  const pinLayer = findLayer(pinData.layerId)
  const saveData = (e) => {
    e.preventDefault();
    let newLayerData = [...layerData]; 
    if(pinState.layerId != pinData.layerId) {
      
      
      const newLayer = findLayer(pinState.layerId); 
      newLayerData = newLayerData.map(l => {
        if(l.id == pinLayer.id) {
          const newPinSet = l.pins.filter(p => p.id != pinState.id);
          return {...l, ...{pins:newPinSet}}
        }
        if(l.id == newLayer.id) {
          const newPinSet = [...l.pins, ...[pinState]];
          return {...l, ...{pins:newPinSet}}
        }
        return l; 
      })
    } else {
      newLayerData = newLayerData.map(l => {
        if(l.id == pinState.layerId) {
          const newPinSet = l.pins.map(p => {
            if(p.id == pinState.id) {
              return pinState
            }
            return p;
          })
          return {...l, ...{pins:newPinSet}}
        }
        return l;
      })
    }
    dispatchEvent({type: "FULL_REFRESH",newData: newLayerData})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
  }
  

  const valueChanger =(value,key) => {
  
    const updater = {};
    updater[key] = value; 
    updatePinState(s => {
     return {...s, ...updater}
    })
  }
  const layer = findLayer(pinState.layerId)
  return (
<div className={styles.editPanelContainer}>
<EditingModalHeader 
saveFunction={saveData}
cancelFunction={(e)=>{e.preventDefault(); activeDispatch({type:"DRAWER_STATE",state:"open"})}}
deleteFunction={e=>{e.preventDefault(); updateDeletePending(true)}}

/>

  <div className={styles.editPanelBody}>

  <TextField name={"title"} label={"Pin name"}>
    <input onChange={(e)=>{ valueChanger(e.target.value,"title")}} value={pinState.title} className={styles.textFieldInput} type="text" name={"title"} id={"title"}/>
  </TextField>
  <TextField name={"description"} label={"Description"} >
    <textarea id={"description"} name={"description"} rows={4} className={`${styles.textFieldInput} ${styles.textarea}`} value={pinState.description||""} onChange={(e)=> {e.preventDefault(); valueChanger(e.target.value,"description")}}/>
  </TextField>
  <TextField name={"layerId"} label={"Layer"}>
    <LayerSelector pinState={pinState} updater={valueChanger}/>
  </TextField>
  <TextField label={"Icon"} >
    <ChangeIcon layer={layer} pinState={pinState} valueChanger={valueChanger}/>
  </TextField>
  <TextField>
    <Switch label={'Favorited'} valueChanger={valueChanger} on={pinState?.favorited} valueKey={"favorited"}/>
  </TextField>
  <TextField>
    <Switch label={'Visited'} valueChanger={valueChanger} on={pinState?.visited} valueKey={"visited"}/>
  </TextField>
  <TextField>
    <Mover id={pinData.id} arraySet={pinLayer.pins} type="pin" arrayId={pinLayer.id}/>
  </TextField>
  <div className={`${styles.deleteButtonContainer} flex-center-center`}>
    <Button onClick={e=>{e.preventDefault(); updateDeletePending(true)}} icon={<RiDeleteBinLine />} modifiers={["caution","secondary"]}>Delete pin</Button>
  </div>
 
  


  </div>
  {deletePending && createPortal(
    <DeleteModal questionText={'Are you sure you want to delete this pin?'} 
    confirmFunction={(e)=> {
      e.preventDefault(); 
      dispatchEvent({
        type: "DELETED_PIN",
        id: pinData.id,
        layerId: pinData.layerId
      })
      activeDispatch({type: "SET_ACTIVE_PIN",id:null})
      activeDispatch({type: "DRAWER_STATE", state: "minimized"});
    }}
    cancelFunction={(e)=>{e.preventDefault(); updateDeletePending(false)}}/>
    
  ,document.getElementById("portal-container"))}
</div>



  )
}
export default ()=><ClientSideSuspense fallback={<ModalLoading/>}><EditPanel/></ClientSideSuspense>