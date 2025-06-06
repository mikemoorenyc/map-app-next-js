'use client'
import Picker from "@emoji-mart/react";
import { createPortal } from 'react-dom';


import {ref} from "@/app/lib/useModalCloser";
import { pick } from "lodash";


export default ({id,updateIconSelectorOpen,updateValue,pickerAnchor,stickToTop}) => {
console.log(pickerAnchor);
const closer = () => {
    console.log("daf");
    updateIconSelectorOpen(false);
  }
const closeModal = useModalCloser(closer, "icon")

  
  const emojiClicked = (e) => {
    updateIconSelectorOpen(prev => {
      return false; 
    });
    const icon = e.native; 
    updateValue(icon,"icon")
  }

  
  const pos = {
    left: pickerAnchor.getBoundingClientRect().left,
    top: stickToTop ? pickerAnchor.getBoundingClientRect().top : "50%",
    transform:stickToTop ? "none":"translateY(-50%)",
    position:"fixed",
    border: "1px solid var(--screen-text)",
    borderRadius: "var(--border-radius)"
  }


  

  return <>
    {createPortal(

       <div className={`z-modal big-drop-shadow`} style={pos} ref={ref}>

        <Picker 
          data={async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_EMOJI_SPRITE,
    )
    
    return response.json()
  }}
          onEmojiSelect={emojiClicked}
          autoFocus={true}
          maxFrequentRows={1}
          set={"twitter"}
          previewPosition={"none"} /></div>

      ,document.getElementById("portal-container")
    )}
  </>
}


//<EmojiPicker onEmojiClick={emojiClicked} suggestedEmojisMode={""} className="IconSelector-picker-container"/>
