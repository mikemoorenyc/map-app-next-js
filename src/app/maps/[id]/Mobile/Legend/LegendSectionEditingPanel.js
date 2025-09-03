import { useContext, useState,useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import styles from "./styles.module.css"
import editorStyles from "../DrawerPanel/EditPanel/EditPanel.module.css"
import EditingModalHeader from "../_components/EditingModalHeader"
import TextField from "../DrawerPanel/EditPanel/TextField"
import Modal from "../../sharedComponents/Modal"
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal"
import lightOrDark from "@/app/lib/lightOrDark"
import DataContext from "@/app/contexts/DataContext"
import ChangeIcon from "../DrawerPanel/EditPanel/ChangeIcon"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
import Mover from "../_components/Mover"
import Button from "@/app/components/Button"
import ColorPicker from "@/app/components/AddMapForm/ColorPicker"
import { RiDeleteBinLine, RiPaintFill } from "@remixicon/react"
import BottomSheet from "@/app/components/BottomSheet/BottomSheet"
import { ClientSideSuspense,useMyPresence } from "@liveblocks/react/suspense"
import useLiveEditing from "@/app/lib/useLiveEditing"
import ModalLoading from "../_components/ModalLoading"
const LegendSectionEditingPanel = ({layerData,deleteFunction,cancelFunction,saveFunction}) => {
  const dispatchEvent = useLiveEditing(); 
  const [tempData,updateTempData] = useState(layerData);
  const {activeDispatch} = useContext(MobileActiveContext);
  const [deletePending,updateDeletePending] = useState(false);
  const dataC = useContext(DataContext)
  
  const [colorPickerOpen,updateColorPickerOpen]= useState(false);
  const [deleteId,updateDeleteId] = useState(false)
  const [saveDisabled,updateSavedDisabled] = useState(false)
  const [myPresence, updateMyPresence] = useMyPresence(); 

  useEffect(()=> {
    updateMyPresence({isEditing:true})
    return () => {
      updateMyPresence({isEditing:false})
    }
  },[])
  

  const valueChanger = (value,key) => {
    const updater = {};
    updater[key] = value; 
    updateTempData(s => {
     return {...s, ...updater}
    })
  }
  const saveData = () => {
    dispatchEvent({
      type:"UPDATED_LAYER",
      id: layerData.id,
      updatedData: tempData
    })
    cancelFunction(); 
  }
  const deleteLayer = useCallback((e) => {
    console.log("called");
    


    if(dataC.layerData.length < 2) {
      alert("Must have at least one layer");
      updateDeletePending(false);
      return false; 
    } 
    activeDispatch({
      type: "SET_ACTIVE_PIN",
      id:null
    })
    activeDispatch({
      type:"REMOVE_DISABLED_LAYER",
      id:layerData.id
    })
    cancelFunction(); 
    dispatchEvent({
      type: "DELETED_LAYER",
      id: layerData.id
    })
  },[dataC])


  return <>
  {createPortal( (
<div className={styles.editingSection}>
        <EditingModalHeader 
          cancelFunction={(e)=>{
            e.preventDefault(); 
            cancelFunction(); 
          }}
          saveFunction={saveDisabled?null:(e)=> {
            e.preventDefault();
            saveData(); 
          }}
          deleteFunction={(e)=>{
            e.preventDefault(); 
            updateDeletePending(true)
          }}
        />
        <div className={styles.editingBody}>
          <TextField name="title" label="Layer name">
            <input 
            onFocus={(e)=> {
                  if(tempData.title == "Untitled Layer") {
                    e.target.select(); 
                  }
                }}
            className={editorStyles.textFieldInput}
              onChange={(e)=> {
                e.preventDefault(); 
                valueChanger(e.target.value,"title");
                if(!e.target.value.length) {
                  updateSavedDisabled(true)
                } else {
                  updateSavedDisabled(false)
                }
              }}
              value={tempData.title}
              type="text"
              name="title"
              id="title"
            />
          <div className={styles.disabledText} style={{visibility:saveDisabled?"visible":"hidden"}}>Layer has to have a name</div>
          </TextField>
          <TextField>
            <div className={styles.layerColorContainer}>
              <div className={styles.layerColorPickerIcon} style={{backgroundColor:tempData.color}}>
               
              </div>
              <Button modifiers={['secondary']} icon={<RiPaintFill/>} onClick={(e)=>{e.preventDefault();updateColorPickerOpen(true)}}>Change Layer Color</Button>
              {colorPickerOpen && <BottomSheet closeCallback={()=> {
                updateColorPickerOpen(false);
              }}>
                <ColorPicker 
              currentColor={tempData.color}
            cancelCallback={()=>{updateColorPickerOpen(false);}}
              selectCallback={(color)=> {
                valueChanger(color,"color")
                valueChanger(lightOrDark(color),"lightOrDark")
              }}
              />
              </BottomSheet>}
              
            
            </div>
          </TextField>
          <TextField>
            <ChangeIcon currentIcon={tempData.icon} valueChanger={valueChanger} type={"layer"}/>
          </TextField>
          <TextField>
            <Mover type="layer" arraySet={dataC.layerData} id={layerData.id} arrayId={layerData.id}/>
          </TextField>
          
          {dataC.layerData.length > 1 && <div  className={`${styles.legendEditDelete} flex-center-center`}>
            <Button modifiers={["caution","secondary","sm"]} icon={<RiDeleteBinLine/>} onClick={(e) => {
      
              e.preventDefault(); 
              updateDeletePending(true);
              updateDeleteId(layerData.id);
            }}>
             Delete layer 
            </Button>
          
          </div>}
        </div> 
    </div>


    ),document.getElementById("portal-container"))}


  {deletePending && <Modal header={"Delete Map"} closeEvent={()=>{updateDeletePending(false); updateDeleteId(null)}}>
    <DeleteConfirmationModal 
      title={'Are you sure you want to delete this layer? All data will be lost'}
      cancelClick={(e)=>{updateDeletePending(false); updateDeleteId(null)}}
      deleteClick={(e)=>{
          e.preventDefault(); 
          updateDeleteId(null);
          updateDeletePending(false);
          cancelFunction(); 
          deleteLayer();
          
      }}

    />
  </Modal>}

  </>
}

export default (props)=><ClientSideSuspense fallback={<ModalLoading />}><LegendSectionEditingPanel {...props}/></ClientSideSuspense>