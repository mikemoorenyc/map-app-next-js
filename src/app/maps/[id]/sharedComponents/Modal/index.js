'use client'
import { createPortal } from "react-dom";
import styles from "./styles.module.css"

import { useEffect } from "react";


const Modal = ({children,header,closeEvent}) => {
  
  const escapePress = (e) => {
      if(e.code === "Escape") {
          closeEvent(); 
      } 
  }
  useEffect(()=> {

    document.body.addEventListener("keydown", escapePress)
    return () => {
      document.body.removeEventListener("keydown",escapePress)
    }
  },[])


  return <>
    {createPortal(
      <div className={`${styles.modal} polka-text`}>
        <div className={`${styles.inner} big-drop-shadow`}>
          <div className={`${styles.header} flex-center`}>
            {header && <div className={`${styles.title} flex-1`}>{header}</div>}

          </div>
          {children}
        
        </div>

      </div>,
      document.getElementById("portal-container")
    )}
  </>
}
export default Modal ; 