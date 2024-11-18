'use client'
import Picker from "@emoji-mart/react";
import  { useContext } from "react";
import { createPortal } from 'react-dom';
import DataContext from '@/app/contexts/DataContext';
export default ({id,updateIconSelectorOpen,onEmojiClick,pickerAnchor}) => {
  const {layerDispatch} = useContext(DataContext)
  const emojiClicked = (e) => {
    updateIconSelectorOpen(prev => {
      return false; 
    });
    console.log("click")
    console.log(e);

  

    const icon = e.native; 
    

    layerDispatch({
      type: "UPDATED_PIN",
      id: id,
      data : {
        icon: icon
      }
    })

    

  }

  
  const pos = {
    left: pickerAnchor.x,
    top: pickerAnchor.y,
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
          maxFrequentRows={0}
          previewPosition={"none"} /></div>
      ,document.getElementById("portal-container")
    )}
  </>
}


//<EmojiPicker onEmojiClick={emojiClicked} suggestedEmojisMode={""} className="IconSelector-picker-container"/>