import { useContext, useState , useRef, useEffect, KeyboardEvent, memo, useMemo, ChangeEvent, useCallback} from "react";
import { TitleInput,DescInput } from "./Header";
import ToastContext from "@/_contexts/ToastContext";
import InfoWindowContext from "@/_contexts/InfoWindowContext";
import ActiveContext from "@/_contexts/ActiveContext";
import LocationDetails from "@/_components/LocationDetails";
import svgImgUrl from "@/_lib/svgImgUrl";
import IconSelector from "../IconSelector";
import InfoWindowHeader from "../InfoWindowHeader";
import Button from "@/_components/Button";
import Linkify from 'linkify-react';
import { useMyPresence } from "@liveblocks/react/suspense";
import styles from "../styles.module.css";
import useLiveEditing from "@/_lib/useLiveEditing";
//import useLayerData from "@/_lib/useLayerData";
import { RiCheckboxCircleFill, RiCheckboxCircleLine, RiDeleteBinLine, RiEmojiStickerLine, RiPencilLine, RiStarFill, RiStarLine } from "@remixicon/react";
import type { TLayer,TPin } from "@/projectTypes";
import useActiveStore from "@/_contexts/useActiveStore";
import { useFindLayer, useFindPin } from "@/_lib/dataHooks";


type TPayloadValues = {
  title?:string, 
  description?:string, 
  icon?:string, 
  favorited?:boolean,
  visited?:boolean,

}
type PayloadEntry =
  | { key: "title"|"description"|"icon"; value: string }
  | { key: "favorited"|"visited"; value: boolean }





type TDisplayProps = {
  pinId:number|string,
  
  canEdit:boolean,
  activeDispatch:Function
}


export default  () => {
  const editingPin = useActiveStore(s=>s.editingPin);
  const pin = useFindPin(editingPin||-1); 
  const currentLayer = useFindLayer(pin?.layerId||-1);
  const [isEditing,updateIsEditing] = useState(false);
  
  //Update if Editing is happening
  const [myPresence,updateMyPrescence] = useMyPresence(); 
  useEffect(()=> {
    updateMyPrescence({isEditing})
    return () => {
      updateMyPrescence({isEditing:false});
    }
  },[isEditing])

  
  if(!pin || !currentLayer) return ; 
  const {title,description} = pin; 
  return <>
    
      <LocationDetails placeData={pin} />
    
  
  </>
}
/*
const PinDisplay = ({pinId,canEdit,activeDispatch}:TDisplayProps) => {
 console.log("open");
  const p = useFindPin(pinId);
  console.log(p)
  if(!p) return ; 
  const currentLayer = useFindLayer(p.layerId);
  if(!currentLayer) {
    throw new Error("No layer");
  }

  const [iconSelectorOpen,updateIconSelectorOpen] = useState(false)
  const [tempData, updateTempData] = useState<TPin>(p);
  const [editingText, updateEditingText] = useState(false);
  
  const dispatchEvent = useLiveEditing(); 
  const {infoWindowDispatch} = useContext(InfoWindowContext)
  const {toastDispatch} = useContext(ToastContext)

  const [myPresence,updateMyPrescence] = useMyPresence(); 


  useEffect(()=> {
    if(editingText||iconSelectorOpen) return ; 
    updateTempData(p);
  },[p.id])



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

  const saveEditing = useCallback(() => {

    dispatchEvent([{
      type: "UPDATED_PIN",
      id: p.id,
      data : {
        title : tempData.title,
        description: tempData.description
      }
    }])
    updateEditingText(false)

  },[dispatchEvent,updateEditingText])



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
      layerId: currentLayer.id
    }])
    
  }


  const pickerContainer = useRef(null);
  


  const keyPressSave = useCallback((e:KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>):void => {
    const metas = ["altKey","shiftKey","ctrlKey","metaKey"];
    if(e.key != "Enter") return; 
    if(metas.filter(k => e[k as keyof KeyboardEvent] == true).length > 0) return; 
    saveEditing(); 
  },[saveEditing]);

  useEffect(()=> {
   updateMyPrescence({isEditing: (editingText || iconSelectorOpen)});

   return () => {
    updateMyPrescence({isEditing:false})
   }

  },[editingText,iconSelectorOpen])

  return  <>

  
  <HeaderMemo 
  {...{editingText,keyPressSave}}
  title={p.title}
  tempTitle={tempData.title}
  onChange={
    useCallback((e:ChangeEvent<HTMLInputElement>):void=>{e.preventDefault(); updateTempValue({title:e.target.value})},[updateTempValue])
  }
  />
  
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
const PinDisplayMemo = memo(PinDisplay);
const Wrapper = () => {
  
  const {activeData,activeDispatch} = useContext(ActiveContext);
  const canEdit = useActiveStore(state => state.canEdit);


  if(!activeData.editingPin) return ; 

  return <PinDisplayMemo pinId={activeData.editingPin} {...{activeDispatch,canEdit}} />
}


const Header = ({editingText,title,tempTitle,keyPressSave,onChange}:{
  editingText:boolean,
  title:string,
  tempTitle:string,
  keyPressSave:(e:KeyboardEvent<HTMLInputElement>)=>void,
  onChange:(e:ChangeEvent<HTMLInputElement>)=>void
}) => {
  console.log("header Update");
 return <InfoWindowHeader>
  {!editingText && title}
  {editingText && <input className={styles.titleInput} tabIndex={1} type="text" value={tempTitle} onKeyDown={keyPressSave} onChange={onChange}/>}

  </InfoWindowHeader>

}
const HeaderMemo = memo(Header);

export default Wrapper;
*/
