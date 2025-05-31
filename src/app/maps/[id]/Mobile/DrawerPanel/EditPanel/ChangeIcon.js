import styles from "./ChangeIcon.module.css"
import Button from "@/app/components/Button"
import Pin from "../../../sharedComponents/Pin"
import {useState,useEffect} from "react";
import Picker from "@emoji-mart/react";
import { createPortal } from "react-dom";

export default function ChangeIcon({pinState,layer,valueChanger}) {
  const [iconSelectorOpen,updateIconSelectorOpen] = useState(false);
  useEffect(()=> {
    const escapePress = (e) => {
      if(e.code === "Escape") {
          if(iconSelectorOpen) {
            console.log("ddd")
            updateIconSelectorOpen(false)
          }
      } 
    }
     document.body.addEventListener("keydown", escapePress)
      return () => {
        document.body.removeEventListener("keydown",escapePress)
      }
  })
  const emojiClicked = (e) => {
    updateIconSelectorOpen(false);
    valueChanger(e.native,"icon")
  }
  return<> 
    <div className={`flex-center`}>
      <Button style={{marginRight:8}} onClick={(e)=>{e.preventDefault(); updateIconSelectorOpen(true)}} modifiers={["secondary"]}>Change icon</Button>
      <Pin 
        pin={pinState}
        layer={layer}
        interactable={false}
        size={20}
        onMap={true}
      />
    </div>

  {iconSelectorOpen && createPortal(
    <div className={`${styles.iconModal} flex-center-center`}>
      <div className={`${styles.pickerContainer} big-drop-shadow`}><Picker 
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
          onClickOutside={()=>{;updateIconSelectorOpen(false)}}
          set={"twitter"}
          /></div>
    </div>
    , document.getElementById("portal-container")
  )}

  </>
}