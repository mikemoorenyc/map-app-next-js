import styles from "../styles.module.css" 
import { useState,KeyboardEvent, useEffect } from "react";
import InfoWindowHeader from "../InfoWindowHeader";
import useActiveStore from "@/_contexts/useActiveStore";
import { useFindPin } from "@/_lib/dataHooks";
import useLiveEditing, { DispatchActions } from "@/_lib/useLiveEditing";

type TProps = {
  isEditing:boolean,
  save: ()=> {}
}
type TInputProps = {
  text:string,
  keyDown: (e:KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>)=>void,
  dispatchEvent:Function
}


//TITLE INPUT
export const TitleInput = ({text="",keyDown,dispatchEvent}:TInputProps)=> {
  const [tempText,updateTempText] = useState(text);

  useEffect(()=> {
    return () => {
      dispatchEvent({
        action:"UPDATE"
      })
    }
  },[])
  
  return <input onKeyDown={(e)=>{keyBoardSave(e,save)}} className={styles.titleInput}  type="text" value={tempText} onChange={(e)=> {
    updateTempText(e.target.value);
  }} tabIndex={1}/>
}
//DESC INPUT
export const DescInput = ({text="",save}:{text?:string,save:()=>void}) => {
  const [tempText,updateTempText] = useState(text);

  return <textarea onKeyDown={(e)=>{keyBoardSave(e,save)}} className={styles.displayDescriptionInput} tabIndex={2}  value={tempText} onChange={(e)=>{updateTempText(e.target.value)}} />
}

export default ({isEditing,save}:TProps) => {
  const editingPin = useActiveStore(s=>s.editingPin);
  const pin = useFindPin(editingPin||-1);
  const dispatchEvent = useLiveEditing(); 
  if(!pin) return ; 
  const {title,description} = pin

  const keyBoardSave = (e:KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const metas = ["altKey","shiftKey","ctrlKey","metaKey"];
    if(e.key != "Enter") return; 
    if(metas.filter(k => e[k as keyof KeyboardEvent] == true).length > 0) return; 
    save();   
  }
  
  
  return <>
  <InfoWindowHeader>
      {!isEditing && title}
      {isEditing && <TitleInput text={title} save={()=>{
        updateIsEditing(false);
      }}/>}

    </InfoWindowHeader>
   
      {!isEditing&&(
      <div className={styles.displayDescription}>
        {description&& <Linkify options={{target:"_blank"}}>{description||""}</Linkify>}
      </div>
      )}
      {isEditing&& <DescInput text={description} save={()=>{updateIsEditing(false)}}/>}
  
  
  </>


}