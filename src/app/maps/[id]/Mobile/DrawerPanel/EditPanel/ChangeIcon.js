import styles from "./ChangeIcon.module.css"
import Button from "@/app/components/Button"
import Pin from "../../../sharedComponents/Pin"
import {useState,useEffect, useCallback, useRef} from "react";
import Picker from "@emoji-mart/react";
import { createPortal } from "react-dom";
import { RiEmojiStickerLine } from "@remixicon/react";

const EmojiContainer = ({emojiClicked,updateOpen,isOpen}) => {
  const container = useRef(null);
  

  const escapePress = (e) => {
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
    if(!container) return ; 
    const checker = (e) => {
      if(!container.current.contains(e.target)) {
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
      process.env.NEXT_PUBLIC_EMOJI_SPRITE,
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

export default function ChangeIcon({pinState,layer,type="pin",valueChanger,currentIcon=null}) {
  const [iconSelectorOpen,updateIconSelectorOpen] = useState(false);

  
  useEffect(()=> {
    console.log(iconSelectorOpen)
  },[iconSelectorOpen]);
  const emojiClicked = (e) => {
    updateIconSelectorOpen(false);
    valueChanger(e.native,"icon")
  }
  const buttonClick = (e)=>{e.preventDefault(); setTimeout(()=>{updateIconSelectorOpen(true)},0)}
  return(
    <div className={`flex-center`}>
      <Button style={{marginRight:8}} onClick={buttonClick} modifiers={["secondary"]}>Change icon</Button>
      <button onClick={buttonClick} style={{width:48,height:48}} className="flex-center-center">
        {type=="pin"&&<Pin 
        pin={pinState}
        layer={layer}
        interactable={false}
        size={20}
        onMap={true}
      />}
      {type !== "pin"&& !currentIcon && <RiEmojiStickerLine width={46} height={46} />}
      {type !== "pin" && currentIcon && <img src={`/api/glyph?icon=${currentIcon}&picker=true&w=46`} width={46} height={46}/>}
      </button>
      {iconSelectorOpen &&createPortal(<EmojiContainer isOpen={iconSelectorOpen} updateOpen={updateIconSelectorOpen} emojiClicked={emojiClicked}/>, document.getElementById('emoji-picker-container'))}
    </div>
  )
  

}