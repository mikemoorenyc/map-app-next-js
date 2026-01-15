import { RiEmojiStickerLine, RiPencilLine } from "@remixicon/react"
import IconSelector from "../MapPanel/PinEditWindow/IconSelector"
import styles from "./Header.module.css"
import { useRef, useState } from "react"
import svgImgUrl from "@/_lib/svgImgUrl"
import { useMyPresence } from "@liveblocks/react/suspense"
import useLiveEditing from "@/_lib/useLiveEditing"
import { useMapIcon } from "@/_lib/dataHooks"
export default function({canEdit}:{mapIcon?:string,canEdit:boolean}) {
  const mapIcon = useMapIcon(); 
  const [iconSelectorOpen,updateIconSelectorOpen] =useState(false)
  const pickerAnchor = useRef(null)
  const [myPresence,updateMyPresence] = useMyPresence(); 
  const dispatchEvent = useLiveEditing(); 
  const iconSelected = (value:string) => {
    updateIconSelectorOpen(false);
    //updateMapIcon(value);
    dispatchEvent([{
      type: "UPDATE_MAP_ICON",
      data: value
    }])
    updateMyPresence({isEditing:false})
  }
  console.log("icon render");
  const w = 24
  return <div style={{marginRight:8}} ref={pickerAnchor}>
    <button disabled={!canEdit} className={`${styles.editMapIconButton}`} onClick={(e) => {
      if(!canEdit) return false; 
      updateMyPresence({isEditing:true})
      updateIconSelectorOpen(true);}}>
      {!mapIcon && <RiEmojiStickerLine className={styles.mapIcon} size={w}/>}
      {mapIcon && <img className={styles.mapIcon} width={w} height={w} src={svgImgUrl({icon:mapIcon})} />}
      {<RiPencilLine className={styles.editMapIcon} size={w} />}
      
    </button>
    {iconSelectorOpen && <IconSelector stickToTop={true} pickerAnchor={pickerAnchor} updateValue={iconSelected} updateIconSelectorOpen={()=>{
      updateIconSelectorOpen(false);
      updateMyPresence({isEditing:false});

    }}   />}
  </div>
}

//<img className={styles.mapIcon} width={w} height={w} src={`/api/glyph?w=${w}&picker=true&icon=${mapIcon}`} />