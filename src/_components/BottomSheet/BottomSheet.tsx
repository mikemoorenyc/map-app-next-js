import { ReactElement, useEffect } from "react"
import styles from "./BottomSheetStyles.module.css"

import PortalContainer from "../PortalContainer/PortalContainer"

type TBottomSheetProps = {
  closeCallback: ()=>void,
  children:ReactElement
}

export default function ({closeCallback,children}:TBottomSheetProps) {


  return <PortalContainer><div className={styles.bottomSheetContainer}>
    <div className={`${styles.closeOverlay} polka-text`} onClick={()=>{closeCallback()}}/>
    <div className={styles.bottomSheet}>
     {children}
    </div>
  
  </div>
  </PortalContainer>
}