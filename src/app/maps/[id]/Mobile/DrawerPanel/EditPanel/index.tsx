
import styles from "./EditPanel.module.css"

import { useContext,useState, useEffect,SyntheticEvent} from "react"
import DataContext from "@/app/contexts/DataContext"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import TextField from "./TextField"
import LayerSelector from "./LayerSelector"
import ChangeIcon from "./ChangeIcon"
import Switch from "./Switch"
import DeleteModal from "../../_components/DeleteModal"
import EditingModalHeader from "../../_components/EditingModalHeader"
import Mover from "../../_components/Mover"
import Button from "@/app/components/Button"
import { RiDeleteBinLine } from "@remixicon/react"
import { ClientSideSuspense,useMyPresence } from "@liveblocks/react"
import useLiveEditing from "@/app/lib/useLiveEditing"
import ModalLoading from "../../_components/ModalLoading"
import useLayerData from "@/app/lib/useLayerData"
import { TPin } from "@/projectTypes"
import PortalContainer from "@/app/components/PortalContainer/PortalContainer"

 function EditPanel() {
  const dispatchEvent = useLiveEditing() ; 
  const {layerData,} = useContext(DataContext);
  const {activeData,activeDispatch} = useContext(MobileActiveContext);
  const {activePin} = activeData;
  const {findPin,findLayer} = useLayerData(); 
  if(!activePin) {
    throw new Error("NO ACTIVE PIN");
  }
  const pinData = findPin(activePin);
  const pinLayer = findLayer(pinData.layerId);
  const initIndex = pinLayer.pins.findIndex(p=>p.id == pinData.id);
 
  //const pinData = useMemo(()=>layerData.map(l => l.pins).flat().find(p => p.id == activePin),[layerData,activePin]);
  const [myPresence,updateMyPrescence] = useMyPresence();

  useEffect(()=> {
    updateMyPrescence({isEditing:true});
    return () => {
      updateMyPrescence({isEditing:false});
    }
  },[])
  
  const [pinState,updatePinState] = useState<TPin>(pinData);
  const [deletePending, updateDeletePending] = useState(false)
  const [pinIndex,updatePinIndex] = useState<number>(initIndex);

  const updateIndex = (i:number) => {
    updatePinIndex(prev => {
      return prev + i ;
    })
  }
 
  

  const saveData = (e:SyntheticEvent) => {
    e.preventDefault();
    let newLayerData = [...layerData]; 
    let layerToUpdate = pinLayer
   

    //PIN DIDN"T MOVE LAYERS 
    if(pinState.layerId === pinData.layerId) {
      layerToUpdate = findLayer(pinState.layerId);
      //REPLACE OLD DATA W/NEW DATA
      const {pins} = layerToUpdate
      //Find CurrentPin
      const currentIndex = pins.findIndex(p=>p.id == pinData.id);
      //REMOVE IT
      const [removedPin]= pins.splice(currentIndex,1);
      //ADD NEW PIN IN NEW POSITION
      pins.splice(pinIndex,0,pinState);
      layerToUpdate.pins = pins; 
      //REPLACE LAYER IN DATA
   
    }else {
    //PIN MOVED LAYERS
    //REMOVE FROM OLD LAYER
    const removedFromOldLayer = {...pinLayer, ...{pins:pinLayer.pins.filter(p=>p.id !== pinState.id)}}
    newLayerData = newLayerData.map(l => {
      if(l.id == removedFromOldLayer.id) {
        return removedFromOldLayer;
      }
      return l;
    })
    const layerToAdd = findLayer(pinState.layerId);
    const {pins} = layerToAdd; 
      pins.splice(pinIndex,0,pinState);
    newLayerData = newLayerData.map(l=> {
      if(l.id == layerToAdd.id) {
        return {...l,...{pins:pins}};
      }
      return l; 
    })

    }
    
 
    dispatchEvent({type: "FULL_REFRESH",newData: newLayerData})
    activeDispatch({type:"DRAWER_STATE",state:"open"})
  }


  

  const valueChanger =(value:any,key:string):void => {
  
    const updater : Partial<TPin> = {};
    updater[key as keyof TPin] = value; 
    updatePinState(s => {
     return {...s, ...updater}
    })
    if(key == "layerId") {
      const newLayer = findLayer(value);
      if(newLayer.id == pinLayer.id) {
        updatePinIndex(initIndex); 
      } else {
        updatePinIndex(newLayer.pins.length)
      }
    }
 
  }
  const currentLayer = findLayer(pinState.layerId);
  const itemArrayLength = pinData.layerId == pinState.layerId?currentLayer.pins.length:currentLayer.pins.length+1; 

  return (
<div className={styles.editPanelContainer}>
<EditingModalHeader 
saveFunction={saveData}
cancelFunction={(e)=>{e.preventDefault(); activeDispatch({type:"DRAWER_STATE",state:"open"})}}
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
  <TextField name={"icon"} label={"Icon"} >
    <ChangeIcon currentIcon={pinState.icon} type={"pin"} layer={currentLayer} pinState={pinState} valueChanger={valueChanger}/>
  </TextField>
  <TextField name={"favorited"}>
    <Switch  label={'Favorited'} valueChanger={valueChanger} on={pinState?.favorited===true} valueKey={"favorited"}/>
  </TextField>
  <TextField name={"visited"}>
    <Switch label={'Visited'} valueChanger={valueChanger} on={pinState?.visited===true} valueKey={"visited"}/>
  </TextField>
  <TextField name={"mover"}>
    <Mover  {...{itemArrayLength, itemIndex:pinIndex,updateIndex}}/>
  </TextField>
  <div className={`${styles.deleteButtonContainer} flex-center-center`}>
    <Button onClick={e=>{e.preventDefault(); updateDeletePending(true)}} icon={<RiDeleteBinLine />} modifiers={["caution","secondary"]}>Delete pin</Button>
  </div>
 
  


  </div>
  {deletePending && <PortalContainer>
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
    
  </PortalContainer>}
</div>



  )
}
export default ()=><ClientSideSuspense fallback={<ModalLoading/>}><EditPanel/></ClientSideSuspense>