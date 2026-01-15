import styles from "./ChangeIcon.module.css"
import Button from "@/_components/Button"
import Pin from "@/_components/Pin"
import {useState,useEffect, useCallback, useRef, SyntheticEvent} from "react";
import Picker from "@emoji-mart/react";
import { createPortal } from "react-dom";
import { RiEmojiStickerLine } from "@remixicon/react";
import { TLayer, TPin } from "@/projectTypes";
import PortalContainer from "@/_components/PortalContainer/PortalContainer";
import svgImgUrl from "@/_lib/svgImgUrl";


type TContainerProps = {
  emojiClicked: (e:{native:string})=>void; 
  updateOpen: (e:boolean)=>void;
  isOpen:boolean
}

const EmojiContainer = ({emojiClicked,updateOpen,isOpen}:TContainerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const spriteSheet = process.env.NEXT_PUBLIC_EMOJI_SPRITE;
  if(!spriteSheet) {
    throw new Error("no sprite sheet")
  }
  

  const escapePress = (e:KeyboardEvent) => {
      console.log(e);
      if(e.code === "Escape") {
        console.log(isOpen);
          if(isOpen) {
            console.log("ddd")
            updateOpen(false)
          }
      }
  }
  useEffect(()=> {
   
     document.body.addEventListener("keydown", escapePress);
     console.log("created");
      return () => {
        console.log("cleaned");
        document.body.removeEventListener("keydown",escapePress)
      }
  },[])
  useEffect(()=> {
    if(!container||container.current===null) return ; 
    const checker = (e:MouseEvent) => {
      if(!container||!container.current) return ;
      if(e.target instanceof Node && !container.current.contains(e.target)) {
        updateOpen(false)
      }
    }
    window.addEventListener("click",checker);
    return () => {
      window.removeEventListener("click",checker);
    }
  },[container])







return <div className={`${styles.iconModal} flex-center-center`} >
      <div ref={container} className={`${styles.pickerContainer} big-drop-shadow`}><Picker 
          data={async () => {
    const response = await fetch(
      spriteSheet,
    )

    return response.json()
  }}
          onEmojiSelect={emojiClicked}
          autoFocus={true}
          maxFrequentRows={1}
          previewPosition={"none"} 
  
          set={"twitter"}
          /></div>
    </div>
}

type TProps = {
  pinState?:TPin,
  layer?:TLayer,
  type?:"pin"|"layer",
  valueChanger: (value:string,key:string)=>void,
  currentIcon: string|undefined
} 

export default function ChangeIcon({pinState,layer,type="pin",valueChanger,currentIcon}:TProps) {
  const [iconSelectorOpen,updateIconSelectorOpen] = useState(false);
  if(type =="pin" && !pinState&&!layer) {
    throw new Error("need pin"); 
  }

  
  useEffect(()=> {
    console.log(iconSelectorOpen)
  },[iconSelectorOpen]);
  const emojiClicked = (e:{native:string}) => {
    updateIconSelectorOpen(false);
    valueChanger(e.native,"icon")
  }
  const buttonClick = (e:SyntheticEvent)=>{e.preventDefault(); setTimeout(()=>{updateIconSelectorOpen(true)},0)}
  return(
    <div className={`flex-center`}>
      <Button style={{marginRight:8}} onClick={buttonClick} modifiers={["secondary"]}>Change icon</Button>
      <button onClick={buttonClick} style={{width:48,height:48}} className="flex-center-center">
        {type=="pin"&&pinState&&layer&&<Pin 
        pin={pinState}
        layer={layer}
        interactable={false}
        size={20}
        onMap={true}
      />}
      {type !== "pin"&& !currentIcon && <RiEmojiStickerLine size={46}/>}
      {type !== "pin" && currentIcon && <img src={svgImgUrl({icon:currentIcon})} width={46} height={46}/>}
      </button>
      {iconSelectorOpen &&<PortalContainer containerId="emoji-picker-container"><EmojiContainer isOpen={iconSelectorOpen} updateOpen={updateIconSelectorOpen} emojiClicked={emojiClicked}/></PortalContainer>}
    </div>
  )
  

}