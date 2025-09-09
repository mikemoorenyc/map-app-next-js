'use client'
import Picker from "@emoji-mart/react";
import { createPortal } from 'react-dom';

import useModalCloser from "@/app/lib/useModalCloser";
import PortalContainer from "@/app/components/PortalContainer/PortalContainer";
import { CSSProperties, RefObject } from "react";

type TProps = {
  updateIconSelectorOpen: (s:boolean) =>void,
  updateValue: (a:string,b:"icon") => void
  pickerAnchor: RefObject<HTMLDivElement|null>,
  stickToTop?: boolean
}
const emojiSprite:string|undefined =process.env.NEXT_PUBLIC_EMOJI_SPRITE


export default ({updateIconSelectorOpen,updateValue,pickerAnchor,stickToTop}:TProps) => {
  if(pickerAnchor===null||!pickerAnchor.current||emojiSprite === undefined)return false; 
  
console.log(pickerAnchor);
const closer = () => {
    console.log("daf");
    updateIconSelectorOpen(false);
  }
  const modalCloser = useModalCloser(closer, "icon");
  if(!modalCloser) return false; 
const {ref,isTop} = modalCloser

  
  const emojiClicked = (e:any) => {
    updateIconSelectorOpen(false);
    const icon = e.native; 
    updateValue(icon,"icon")
  }

  
  const pos :CSSProperties = {
    left: pickerAnchor.current.getBoundingClientRect().left,
    top: stickToTop ? pickerAnchor.current.getBoundingClientRect().top : "50%",
    transform:stickToTop ? "none":"translateY(-50%)",
    position:"fixed",
    border: "1px solid var(--screen-text)",
    borderRadius: "var(--border-radius)"
  }


  

  return <PortalContainer>

       <div className={`z-modal big-drop-shadow ${isTop?"z-interactive-top":""}`} style={pos} ref={ref}>

        <Picker 
          data={async () => {
    const response = await fetch(
      emojiSprite,
    )
    
    return response.json()
  }}
          onEmojiSelect={emojiClicked}
          autoFocus={true}
          maxFrequentRows={1}
          set={"twitter"}
          previewPosition={"none"} /></div>

  </PortalContainer>
}


//<EmojiPicker onEmojiClick={emojiClicked} suggestedEmojisMode={""} className="IconSelector-picker-container"/>
