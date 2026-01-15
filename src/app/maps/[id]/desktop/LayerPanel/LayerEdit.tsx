import { useContext,useState,useRef, useEffect, SyntheticEvent, ChangeEvent } from "react"
import DataContext from "@/_contexts/DataContext"
import ActiveContext from "@/_contexts/ActiveContext"
import lightOrDark from "@/_lib/lightOrDark"
import Modal from "../../../../../_components/Modal"
import Button from "@/_components/Button"
import styles from "./LayerEdit.module.css"
import ActionBar from "../../../../../_components/ActionBar"
import DeleteConfirmationModal from "@/_components/DeleteConfirmationModal"
import ColorPicker from "@/_components/AddMapForm/ColorPicker"
import DropDown from "@/_components/DropDown/DropDown"
import IconSelector from "../MapPanel/PinEditWindow/IconSelector"
import { RiEmojiStickerLine } from "@remixicon/react"
import svgImgUrl from "@/_lib/svgImgUrl"
import { ClientSideSuspense } from "@liveblocks/react"
import { useMyPresence } from "@liveblocks/react"
import useLiveEditing from "@/_lib/useLiveEditing"

import { useLayers } from "@/_lib/dataHooks"
import useActiveStore from "@/_contexts/useActiveStore"

type TInputValues = {
  icon?:string, 
  title?:string,
  color?:string,
  lightOrDark?:string,
}

const LayerEdit = () => {
  const dispatchEvent = useLiveEditing(); 

  const layerData = useLayers(); 
  const editingLayer = useActiveStore(state => state.editingLayer);
  const updateEditingLayer = useActiveStore(s=>s.updateEditingLayer);
  const updateActiveLayer = useActiveStore(s=>s.updateActiveLayer);
  const layer = layerData.find(layer => layer.id == editingLayer);
  if(!layer)return ; 
  const [tempLayerData, updateTempLayerData] = useState({icon:layer.icon, title: layer.title, color:layer.color,lightOrDark: layer?.lightOrDark});
  const [deleteConfirmation, updateDeleteConfirmation] = useState<false|"pending">(false)
  const [colorPickerOpen,updateColorPickerOpen] =useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);
  const [iconPickerOpen,updateIconPickerOpen] = useState(false)

  const colorPickerButtonRef = useRef(null)
  const [myPresence,updateMyPresence] = useMyPresence(); 
  useEffect(()=> {
    updateMyPresence({isEditing:true})
    return ()=> {
      updateMyPresence({isEditing:false})
    }
  },[])

  const saveData = () => {
    console.log(tempLayerData)
        dispatchEvent([{
            type: "UPDATED_LAYER",
            id: layer.id,
            updatedData: tempLayerData
        }]);
        updateEditingLayer(null);
  }
  const cancelEdit = () => {
    updateEditingLayer(null); 
  }
  const deleteLayer = (e:SyntheticEvent) => {
    e.preventDefault(); 
    dispatchEvent([{
        type: "DELETED_LAYER",
        id : layer.id
    }])
    updateEditingLayer(null)
    updateActiveLayer(null)
  }

  /*
  useEffect(()=> {
    document.body.addEventListener("keydown", keyPressSave)
    return () => {
      document.body.removeEventListener("keydown",keyPressSave)
    }
  },[])*/
  const inputer = (e:ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
     
        updateTempLayerData(prev => {
            const payload: TInputValues = {};
            const attrString = e.target.getAttribute("name");
            if(!attrString|| !["icon" , "title" , "color" , "lightOrDark"].includes(attrString)) {
              throw Error(); 
            }
            
            payload[attrString as keyof TInputValues] = e.target.value;
            
            if(attrString == "color") {
                payload.lightOrDark = lightOrDark(e.target.value);
            } 
            return {...prev, ...payload}
        })
  }

  const updateColor = (color:string) => {
    console.log(color,lightOrDark(color));
    updateTempLayerData(prev => {
      const payload = {
        color: color,
        lightOrDark: lightOrDark(color)
      };
   
      return {...prev,...payload};

    })
  }
  const updateIcon = (icon:string) => {
    updateTempLayerData(prev => {
      return {...prev, ...{icon:icon}}
    })
  }
  if(deleteConfirmation == "pending") {
    return <Modal header={"Edit Layer"} closeEvent={cancelEdit}>
    <DeleteConfirmationModal title={`Are you sure you want to delete ${layer.title}?`} cancelClick={(e:SyntheticEvent)=>{e.preventDefault(); updateDeleteConfirmation(false)}} deleteClick={deleteLayer}/>
    </Modal>
  }

  
  //(e)=>{e.preventDefault(); updateDeleteConfirmation(false)}
  //deleteLayer
  return <Modal header={"Edit Layer"} closeEvent={cancelEdit}>

    <div className="editing" style={{width: 350}}>
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
                        {tempLayerData.icon ? <img width={32} height={32} src={svgImgUrl({icon:tempLayerData.icon})} />: <RiEmojiStickerLine size={32} />}
                    </button>
                    <Button style={{marginLeft: 8}} modifiers={["sm","ghost"]} onClick={()=>{updateIconPickerOpen(!iconPickerOpen)}}>Pick layer icon</Button>
                  </div>
                   {iconPickerOpen && <IconSelector pickerAnchor={iconPickerRef} updateIconSelectorOpen={updateIconPickerOpen} updateValue={updateIcon} />}
                </div>
                {(colorPickerOpen && colorPickerButtonRef.current) && <DropDown anchor={colorPickerButtonRef.current} dir={"left"} closeCallback={()=>{updateColorPickerOpen(false)}}>
                  <ColorPicker cancelCallback={()=> {
            updateColorPickerOpen(false);
           }}
           currentColor={tempLayerData.color}
           selectCallback={(color:string)=> {
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
     
 
    </div>
  
  </Modal>
    

}
export default ()=><ClientSideSuspense fallback={<div></div>}><LayerEdit /></ClientSideSuspense>


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
