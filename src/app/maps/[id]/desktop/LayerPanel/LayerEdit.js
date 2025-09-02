import { useContext,useState,useRef, useEffect } from "react"
import DataContext from "@/app/contexts/DataContext"
import ActiveContext from "@/app/contexts/ActiveContext"
import lightOrDark from "@/app/lib/lightOrDark"
import Modal from "../../sharedComponents/Modal"
import Button from "@/app/components/Button"
import styles from "./LayerEdit.module.css"
import ActionBar from "../../sharedComponents/ActionBar"
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal"
import ColorPicker from "@/app/components/AddMapForm/ColorPicker"
import DropDown from "@/app/components/DropDown/DropDown"
import IconSelector from "../MapPanel/PinEditWindow/IconSelector"
import { RiEmojiStickerLine } from "@remixicon/react"
import svgImgUrl from "@/app/lib/svgImgUrl"
import { ClientSideSuspense } from "@liveblocks/react"
import { useMyPresence } from "@liveblocks/react"
import useLiveEditing from "@/app/lib/useLiveEditing"

const LayerEdit = () => {
  const dispatchEvent = useLiveEditing(); 
  const {activeData,activeDispatch} = useContext(ActiveContext)
  const {layerData, layerDispatch} = useContext(DataContext)
  const editingLayer = activeData.editingLayer
  const layer = layerData.find(layer => layer.id == editingLayer);
  if(!layer)return ; 
  const [tempLayerData, updateTempLayerData] = useState({icon:layer.icon, title: layer.title, color:layer.color,lightOrDark: layer?.lightOrDark});
  const [deleteConfirmation, updateDeleteConfirmation] = useState(false)
  const [colorPickerOpen,updateColorPickerOpen] =useState(false);
  const iconPickerRef = useRef(null);
  const [iconPickerOpen,updateIconPickerOpen] = useState(false)

  const colorPickerButtonRef = useRef(null)
  const [myPresence,updateMyPresence] = useMyPresence(); 
  useEffect(()=> {
    updateMyPresence({isEditing:true})
    return ()=> {
      updateMyPresence({isEditing:false})
    }
  },[])

  const saveData = (e) => {
    console.log(tempLayerData)
        dispatchEvent({
            type: "UPDATED_LAYER",
            id: layer.id,
            updatedData: tempLayerData
        });
        activeDispatch({
            type: "EDITING_LAYER",
            id:null
        })
  }
  const cancelEdit = () => {
    activeDispatch({
        type: "EDITING_LAYER",
        id:null
    })
  }
  const deleteLayer = (e) => {
    e.preventDefault(); 
    dispatchEvent({
        type: "DELETED_LAYER",
        id : layer.id
    })
    activeDispatch({
        type: "EDITING_LAYER",
        id:null
    })
    activeDispatch({
        type: "ACTIVE_LAYER",
        id: null
    })
  }
  const keyPressSave = (e) => {
    console.log(tempLayerData.title);
    const metas = ["altKey","shiftKey","ctrlKey","metaKey"];
    if(e.key === "Enter" && metas.filter(k => e[k] == true).length === 0){
      saveData()
    } 

  }
  /*
  useEffect(()=> {
    document.body.addEventListener("keydown", keyPressSave)
    return () => {
      document.body.removeEventListener("keydown",keyPressSave)
    }
  },[])*/
  const inputer = (e) => {
        e.preventDefault(e);
     
        updateTempLayerData(prev => {
            const payload = {};
            const attr = e.target.getAttribute("name")
            payload[attr] = e.target.value;
            if(attr == "color") {
                payload.lightOrDark = lightOrDark(e.target.value);
            } 
            return {...prev, ...payload}
        })
  }

  const updateColor = (color) => {
    updateTempLayerData(prev => {
      const payload = {
        color: color,
        lightOrDark: lightOrDark(color)
      };
      return {...prev,...payload};

    })
  }
  const updateIcon = (icon) => {
    updateTempLayerData(prev => {
      return {...prev, ...{icon:icon}}
    })
  }
  
  //(e)=>{e.preventDefault(); updateDeleteConfirmation(false)}
  //deleteLayer
  return <Modal header={"Edit Layer"} closeEvent={cancelEdit}>
    {deleteConfirmation == "pending" && <DeleteConfirmationModal title={`Are you sure you want to delete ${layer.title}?`} cancelClick={(e)=>{e.preventDefault(); updateDeleteConfirmation(false)}} deleteClick={deleteLayer}/>}
    {!deleteConfirmation && <div className="editing" style={{width: 350}}>
      <div>
            <div className={`${styles.layerEditSection} flex-center`} key={"title"}>
                <label className={styles.sectionLabel} htmlFor="title">Layer name</label>
                <input className={"flex-1"} onChange={inputer} name="title" type="text" value={tempLayerData.title} onFocus={(e)=> {
                  if(tempLayerData.title == "Untitled Layer") {
                    e.target.select(); 
                  }
                }}/>
            </div>
            <div className={`${styles.layerEditSection} flex-center`}  key={"color"}>
                <label className={styles.sectionLabel}>Color</label>
                <div  ref={colorPickerButtonRef} className={`flex-center`}>
                  <button className={styles.colorPickerContainer} onClick={(e)=>{e.preventDefault(); updateColorPickerOpen(!colorPickerOpen)}}>
                    <div style={{background:tempLayerData.color}} className={styles.colorPickerMask} />
                  </button>
                  <div style={{marginLeft: 8}} >
                    <Button modifiers={["ghost"]}
                      onClick={(e)=> {
                        console.log("click");
                        if(colorPickerOpen) return ; 
                        updateColorPickerOpen(!colorPickerOpen);
                      }}
                    >
                      Pick layer color
                    </Button>

                  </div>
                </div>   
                
                
                    
                
                </div>   
                <div className={`${styles.layerEditSection} flex-center`} key={"icon"}>
                  <label className={styles.sectionLabel}>Icon</label>
                  <div className={'flex-center'} ref={iconPickerRef}>
                    <button onClick={(e)=>{e.preventDefault(); updateIconPickerOpen(!iconPickerOpen)}}>
                        {tempLayerData.icon ? <img width={32} height={32} src={svgImgUrl({icon:tempLayerData.icon})} />: <RiEmojiStickerLine width={32} height={32}/>}
                    </button>
                    <Button style={{marginLeft: 8}} modifiers={["sm","ghost"]} onClick={()=>{updateIconPickerOpen(!iconPickerOpen)}}>Pick layer icon</Button>
                  </div>
                   {iconPickerOpen && <IconSelector pickerAnchor={iconPickerRef.current} updateIconSelectorOpen={updateIconPickerOpen} updateValue={updateIcon} />}
                </div>
                {colorPickerOpen && <DropDown anchor={colorPickerButtonRef.current} dir={"left"} closeCallback={()=>{updateColorPickerOpen(false)}}>
                  <ColorPicker cancelCallback={()=> {
            updateColorPickerOpen(false);
           }}
           currentColor={tempLayerData.color}
           selectCallback={(color)=> {
            updateColor(color);
           }}
           
           />
                </DropDown>}    
                  
            
          
      </div>
            <ActionBar 
            style={{marginTop: 16,borderTop:"1px solid var(--screen-text)"}}
            primaryButtons={layerData.length > 1 && (
             <>
              <Button modifiers={["ghost","sm","caution"]} onClick={(e) => {e.preventDefault(); updateDeleteConfirmation("pending")}}>
                Delete 
            </Button>
              </>
            )}
            secondaryButtons={ (
               <>
              <div style={{display:"flex",justifyContent:"flex-end", width: "100%"}}>
                <Button onClick={cancelEdit} modifiers={["secondary"]}>Cancel</Button>
                <Button style={{marginLeft:8}} onClick={saveData} >Save layer</Button>
              </div>
              </>
              
            )}
            />
     
 
    </div>}
  
  </Modal>
    

}
export default ()=><ClientSideSuspense><LayerEdit /></ClientSideSuspense>


/*

 {colorPickerOpen && <div
            style={{position:"fixed",left:colorPickerPosition[0],top:colorPickerPosition[1]}}
           ><ColorPicker cancelCallback={()=> {
            updateColorPickerOpen(false);
           }}
           currentColor={tempLayerData.color}
           selectCallback={(color)=> {
            updateColor(color);
           }}
           
           /> </div> }

           */
