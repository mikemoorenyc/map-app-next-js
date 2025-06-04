'use client'
import { createPortal } from "react-dom";
import styles from "./styles.module.css"
import useKeyPress from "@/lib/useKeyPress"
import useClickOutside from "@/lib/useClickOutside"
import { useRef } from "react";


const Modal = ({children,header,closeEvent}) => {
  const escapePress = useKeyPress("Escape",closeEvent)
  const modalContainer = useRef(null); 
  const clickOutside = useClickOutside(modalContainer.current, closeEvent); 
 

  return <>
    {createPortal(
      <div className={`${styles.modal} polka-text`}>
        <div ref={modalContainer} className={`${styles.inner} big-drop-shadow`}>
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
