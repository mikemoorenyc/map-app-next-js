import { useEffect } from "react"
import styles from "./BottomSheetStyles.module.css"
import { createPortal } from "react-dom"

export default function ({closeCallback,children}) {


  return <>
  {createPortal(<div className={styles.bottomSheetContainer}>
    <div className={`${styles.closeOverlay} polka-text`} onClick={()=>{closeCallback()}}/>
    <div className={styles.bottomSheet}>
     {children}
    </div>
  
  </div>,document.getElementById("portal-container"))}
</>
}