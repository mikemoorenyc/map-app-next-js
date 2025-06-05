'use client'
import { createPortal } from "react-dom";
import styles from "./styles.module.css"

import useModalCloser from "@/app/lib/useModalCloser";



const Modal = ({children,header,closeEvent}) => {

  const modalCloser = useModalCloser(closeEvent,"modal");
  
 

  return <>
    {createPortal(
      <div className={`${styles.modal} polka-text z-modal`}>
        
        <div ref={modalCloser} className={`${styles.inner} big-drop-shadow `}>
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
