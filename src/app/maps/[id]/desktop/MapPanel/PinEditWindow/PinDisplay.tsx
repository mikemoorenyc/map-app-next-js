import { useContext, useState , useRef, useEffect, KeyboardEvent} from "react";
import DataContext from "@/app/contexts/DataContext";
import ToastContext from "@/app/contexts/ToastContext";
import InfoWindowContext from "@/app/contexts/InfoWindowContext";
import ActiveContext from "@/app/contexts/ActiveContext";
import LocationDetails from "@/app/components/LocationDetails";
import svgImgUrl from "@/app/lib/svgImgUrl";
import IconSelector from "./IconSelector";
import InfoWindowHeader from "./InfoWindowHeader";
import Button from "@/app/components/Button";
import Linkify from 'linkify-react';
import { useMyPresence } from "@liveblocks/react/suspense";
import styles from "./styles.module.css";
import useLiveEditing from "@/app/lib/useLiveEditing";
import useLayerData from "@/app/lib/useLayerData";
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiDeleteBinLine, RiEmojiStickerLine, RiPencilLine, RiStarFill, RiStarLine } from "@remixicon/react";


type TPayloadValues = {
  title?:string, 
  description?:string, 
  icon?:string, 
  favorited?:boolean,
  visited?:boolean
}
type PayloadEntry =
  | { key: "title"|"description"|"icon"; value: string }
  | { key: "favorited"|"visited"; value: boolean }




export default () => {
  const layerData = useLayerData().layers; 
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const {findPin,findLayer} = useLayerData(); 
  if(!activeData.editingPin) return ; 
  const p = findPin(activeData.editingPin);
  const {canEdit} = activeData;

  if(!p) return ; 

  const [iconSelectorOpen,updateIconSelectorOpen] = useState(false)
  const [tempData, updateTempData] = useState<TPayloadValues>(p);
  const [editingText, updateEditingText] = useState(false);
  
  const dispatchEvent = useLiveEditing(); 
  const {infoWindowDispatch} = useContext(InfoWindowContext)
  const {toastDispatch} = useContext(ToastContext)

  const [myPresence,updateMyPrescence] = useMyPresence(); 


  useEffect(()=> {
    if(editingText||iconSelectorOpen) return ; 
    updateTempData(p);
  },[p])

  const currentLayer = findLayer(p.layerId);
  if(!currentLayer) return false; 

  const pinIndex = currentLayer.pins.findIndex(pin => pin.id == p.id);

  
  const updateTempValue = (newValues:TPayloadValues) => {

    updateTempData(prev => {

        return {...prev, ...newValues}
    })
  }
  const cancelEditing = () => {
    updateEditingText(false);
    updateTempData(p);
  }

  const saveEditing = () => {

    dispatchEvent([{
      type: "UPDATED_PIN",
      id: p.id,
      data : {
        title : tempData.title,
        description: tempData.description
      }
    }])
    updateEditingText(false)

  }



  const updateValue = (value:string|boolean,key:string) => {

    const payload: TPayloadValues = { [key]: value } as TPayloadValues;

    dispatchEvent([{
      type: "UPDATED_PIN",
      id: p.id,
      data: payload
    }])
  }

  //DELETING THINGS


  const undoPinDelete = () => {
    console.log("click");
    dispatchEvent([{
      type: "SPLICED_PIN",
      pin: p,
      spliceIndex: pinIndex
    }])
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

    infoWindowDispatch({type:"CLOSE_WINDOW"})
    activeDispatch({
      type: "EDITING_PIN",
      id: null
    })
    dispatchEvent([{
      type: "DELETED_PIN",
      id: p.id,
      layerId: layerData.filter(layer => layer.id == p.layerId)[0].id
    }])
    
  }


  const pickerContainer = useRef(null);
  


  const keyPressSave = (e:KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const metas = ["altKey","shiftKey","ctrlKey","metaKey"];
    if(e.key != "Enter") return; 
    if(metas.filter(k => e[k as keyof KeyboardEvent] == true).length > 0) return; 
    saveEditing(); 
  }

  useEffect(()=> {
   updateMyPrescence({isEditing: (editingText || iconSelectorOpen)});

   return () => {
    updateMyPrescence({isEditing:false})
   }

  },[editingText,iconSelectorOpen])
  const linkifyOptions = {
    target:"_blank"
  }
  return  <>

  
  <InfoWindowHeader>
  {!editingText && p.title}
  {editingText && <input className={styles.titleInput} tabIndex={1} type="text" value={tempData.title} onKeyDown={keyPressSave} onChange={(e)=>{e.preventDefault(); updateTempValue({title:e.target.value})}}/>}

  </InfoWindowHeader>
  
  <div className="PinDisplay-container">
    {!editingText&&<div className={styles.displayDescription}>
    {p.description&& <Linkify options={{target:"_blank"}}>{p?.description||""}</Linkify>}
    </div>}
  
    {editingText && <textarea className={styles.displayDescriptionInput} tabIndex={2} onKeyDown={keyPressSave} value={tempData.description ||""} onChange={(e) => {e.preventDefault(); updateTempValue({description: e.target.value})}} />}
    <LocationDetails placeData={p} />

  </div>
  <div className={styles.controls} style={{visibility: !canEdit?"hidden":"visible"}}>
    {!editingText&&<div className={`${styles.controlsDefault} display-flex`}>
        <div className="flex-center">
        <div ref={pickerContainer} style={{position:"relative",cursor: "pointer"}} className={styles.controlContainer} onClick={(e)=>{updateIconSelectorOpen(true)}}>
          {p.icon? <img src={svgImgUrl({icon:p.icon})} width={22} height={22} />  :<RiEmojiStickerLine />}
        </div>
        {iconSelectorOpen && pickerContainer && <IconSelector updateValue={updateValue} pickerAnchor={pickerContainer} updateIconSelectorOpen={()=>{updateIconSelectorOpen(false);updateMyPrescence({isEditing:false})}}  />}
        <button disabled={!canEdit} onClick={()=>{updateValue(p?.favorited ? false : true,"favorited")}} style={{marginRight:6}}>
            {p.favorited ? <RiStarFill /> : <RiStarLine />}
          </button>
          <button disabled={!canEdit} onClick={()=>{updateValue(p?.visited ? false : true,"visited")}}>{!p?.visited ? <RiCheckboxCircleLine />:<RiCheckboxCircleFill/>}</button>



        </div>
        <div className="flex-center">
            <button disabled={!canEdit} style={{marginRight:4}} onClick={(e)=>{e.preventDefault();updateEditingText(true)}}><RiPencilLine /></button><br/>
            <button disabled={!canEdit} onClick={(e)=>{deletePin()}}><RiDeleteBinLine/></button>

        </div>
    </div>
    }
    {editingText && <div className={`${styles.controlsDefault} flex-center`} style={{justifyContent:"flex-start"}}>
    <Button modifiers={["sm"]} style={{marginRight:6, width:80}}  onClick={(e)=>{e.preventDefault(); saveEditing()}} >Save</Button>
      <Button style={{}} modifiers={["secondary","sm"]} onClick={cancelEditing} >Cancel</Button>
      
    
    </div>}
  
  </div>


  
  

  

  


  </>
}


