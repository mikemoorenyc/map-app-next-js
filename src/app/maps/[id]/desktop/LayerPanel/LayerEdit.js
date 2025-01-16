import { useContext,useState,useEffect,useRef } from "react"
import DataContext from "@/app/contexts/DataContext"
import ActiveContext from "@/app/contexts/ActiveContext"
import lightOrDark from "@/app/lib/lightOrDark"
import Modal from "../../sharedComponents/Modal"
import Button from "@/app/components/Button"
import styles from "./LayerEdit.module.css"
import ActionBar from "../../sharedComponents/ActionBar"
import DeleteConfirmationModal from "@/app/components/DeleteConfirmationModal"
import ColorPicker from "@/app/components/AddMapForm/ColorPicker"


const LayerEdit = () => {
  const {activeData,activeDispatch} = useContext(ActiveContext)
  const {layerData, layerDispatch} = useContext(DataContext)
  const editingLayer = activeData.editingLayer
  const layer = layerData.find(layer => layer.id == editingLayer);
  if(!layer)return ; 
  const [tempLayerData, updateTempLayerData] = useState({title: layer.title, color:layer.color,lightOrDark: layer?.lightOrDark});
  const [deleteConfirmation, updateDeleteConfirmation] = useState(false)
  const [colorPickerOpen,updateColorPickerOpen] =useState(false);
  const [colorPickerPosition,updateColorPickerPosition] = useState([0,0]);
  const colorPickerButtonRef = useRef(null)
  const saveData = (e) => {
    console.log(tempLayerData)
        layerDispatch({
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
    layerDispatch({
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
        console.log(tempLayerData.title); 
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
  const openColorPicker = () => {
    console.log(colorPickerButtonRef.current.offsetLeft)
    updateColorPickerPosition([colorPickerButtonRef.current.offsetLeft,colorPickerButtonRef.current.offsetTop]);
    updateColorPickerOpen(true);
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
  
  //(e)=>{e.preventDefault(); updateDeleteConfirmation(false)}
  //deleteLayer
  return <Modal header={"Edit Layer"} closeEvent={cancelEdit}>
    {deleteConfirmation == "pending" && <DeleteConfirmationModal title={'Are you sure you want to delete this layer?'} cancelClick={(e)=>{e.preventDefault(); updateDeleteConfirmation(false)}} deleteClick={deleteLayer}/>}
    {!deleteConfirmation && <div className="editing" style={{width: 350}}>
      <div>
            <div className={`${styles.layerEditSection} flex-center`} key={"title"}>
                <label className={styles.sectionLabel} htmlFor="title">Layer name</label>
                <input className={"flex-1"} onChange={inputer} name="title" type="text" value={tempLayerData.title}/>
            </div>
            <div className={`${styles.layerEditSection} flex-center`}  key={"color"}>
                <label className={styles.sectionLabel}>Color</label>
                <div className={styles.colorPickerContainer}>
                    
                    <div style={{background:tempLayerData.color}} className={styles.colorPickerMask}></div>
                </div>
                <div style={{marginLeft: 8}} ref={colorPickerButtonRef}><Button 
                onClick={(e)=> {
                  e.preventDefault();
                  openColorPicker()
                }}
                
                >Pick layer color</Button></div>       
                  
            </div>
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
      </div>
            <ActionBar 
            style={{marginTop: 16,borderTop:"1px solid var(--screen-text)"}}
            primaryButtons={(
              <>
              <Button onClick={saveData} >Save layer</Button>
              <Button onClick={cancelEdit} modifiers={["secondary"]}>Cancel</Button>
              </>
            )}
            secondaryButtons={layerData.length > 1 && (
              <>
              <Button modifiers={["ghost","sm","caution"]} onClick={(e) => {e.preventDefault(); updateDeleteConfirmation("pending")}}>
                Delete Layer
            </Button>
              </>
            )}
            />
     
 
    </div>}
  
  </Modal>
    

}
export default LayerEdit