'use client'
import Picker from "@emoji-mart/react";
import { transform } from "lodash";
import { createPortal } from 'react-dom';

export default ({id,updateIconSelectorOpen,updateValue,pickerAnchor}) => {

  const emojiClicked = (e) => {
    updateIconSelectorOpen(prev => {
      return false; 
    });
    const icon = e.native; 
    updateValue(icon,"icon")
  }

  
  const pos = {
    left: pickerAnchor.x,
    top: "50%",
    transform:"translateY(-50%)",
    position:"fixed",
    
  }

  return <>
    {createPortal(
      <div style={pos} >

        <Picker 
          data={async () => {
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@emoji-mart/data',
    )

    return response.json()
  }}
          onEmojiSelect={emojiClicked}
          autoFocus={true}
          maxFrequentRows={1}
          previewPosition={"none"} /></div>
      ,document.getElementById("portal-container")
    )}
  </>
}


//<EmojiPicker onEmojiClick={emojiClicked} suggestedEmojisMode={""} className="IconSelector-picker-container"/>