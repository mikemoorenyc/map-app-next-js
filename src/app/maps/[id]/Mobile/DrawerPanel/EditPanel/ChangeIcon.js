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
    <Button onClick={(e)=>{e.preventDefault(); updateIconSelectorOpen(true)}} className={`${styles.button } round-border`} style={{textAlign:"left"}}>
      
      <span className={`flex-1`} style={{paddingRight: 6}}>Change icon</span>
      <span>
      <Pin 
        pin={pinState}
        layer={layer}
        interactable={false}
        size={12}
      />
      </span>
  </Button>
  {iconSelectorOpen && createPortal(
    <div className={`${styles.iconModal} flex-center-center`}>
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
          previewPosition={"none"} 
          onClickOutside={()=>{;updateIconSelectorOpen(false)}}
          />
    </div>
    , document.getElementById("portal-container")
  )}

  </>
}