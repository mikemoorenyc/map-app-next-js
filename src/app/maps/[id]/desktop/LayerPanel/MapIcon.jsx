import { RiEmojiStickerLine, RiPencilLine } from "@remixicon/react"
import IconSelector from "../MapPanel/PinEditWindow/IconSelector"
import styles from "./Header.module.css"
import { useRef, useState } from "react"
import svgImgUrl from "@/app/lib/svgImgUrl"
export default function({mapIcon,updateMapIcon}) {

  const [iconSelectorOpen,updateIconSelectorOpen] =useState(false)
  const pickerAnchor = useRef(null)

  const iconSelected = (value) => {
    updateIconSelectorOpen(false);
    updateMapIcon(value);
  }

  const w = 24
  return <div style={{marginRight:8}} ref={pickerAnchor}>
    <button className={styles.editMapIconButton} onClick={(e) => {updateIconSelectorOpen(true)}}>
      {!mapIcon && <RiEmojiStickerLine className={styles.mapIcon} width={w} height={w}/>}
      {mapIcon && <img className={styles.mapIcon} width={w} height={w} src={svgImgUrl({icon:mapIcon})} />}
      {<RiPencilLine className={styles.editMapIcon} width={w} height={w} />}
      
    </button>
    {iconSelectorOpen && <IconSelector stickToTop={true} pickerAnchor={pickerAnchor.current} updateValue={iconSelected} updateIconSelectorOpen={updateIconSelectorOpen}   />}
  </div>
}

//<img className={styles.mapIcon} width={w} height={w} src={`/api/glyph?w=${w}&picker=true&icon=${mapIcon}`} />