import { useContext, useState,useCallback } from "react"
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
export default ({layerData,deleteFunction,cancelFunction,saveFunction}) => {

  const [tempData,updateTempData] = useState(layerData);
  const {activeDispatch} = useContext(MobileActiveContext);
  const [deletePending,updateDeletePending] = useState(false);
  const dataC = useContext(DataContext)
  const {layerDispatch} = dataC;
  const [colorPickerOpen,updateColorPickerOpen]= useState(false);
  const [deleteId,updateDeleteId] = useState(false)
  

  const valueChanger = (value,key) => {
    const updater = {};
    updater[key] = value; 
    updateTempData(s => {
     return {...s, ...updater}
    })
  }
  const saveData = () => {
    layerDispatch({
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
    layerDispatch({
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
          saveFunction={(e)=> {
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
            className={editorStyles.textFieldInput}
              onChange={(e)=> {
                e.preventDefault(); 
                valueChanger(e.target.value,"title")
              }}
              value={tempData.title}
              type="text"
              name="title"
              id="title"
            />
          
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