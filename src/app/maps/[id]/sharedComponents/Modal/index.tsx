'use client'

import styles from "./styles.module.css"

import useModalCloser from "@/app/lib/useModalCloser";
import PortalContainer from "@/app/components/PortalContainer/PortalContainer";
import { ReactElement } from "react";

type TModalProps = {
  children:ReactElement|ReactElement[]|string,
  header?:string,
  closeEvent:()=>void
}


const Modal = ({children,header,closeEvent}:TModalProps) => {
  const modalCloser = useModalCloser(closeEvent,"modal");
  if(!modalCloser) return ; 
  const {ref,isTop} = modalCloser;
 
 

  return <PortalContainer>
      <div className={`${styles.modal} polka-text z-modal ${isTop?"z-interactive-top":""}`}>
        
        <div ref={ref} className={`${styles.inner} big-drop-shadow `}>
          <div className={`${styles.header} flex-center`}>
            {header && <div className={`${styles.title} flex-1`}>{header}</div>}

          </div>
          {children}
        
        </div>

      </div>
      </PortalContainer>
}
export default Modal ; 
