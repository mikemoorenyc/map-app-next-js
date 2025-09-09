import { createPortal } from "react-dom"
import styles from "./DropDownStyles.module.css"
import { ReactElement, useEffect, useLayoutEffect,useRef,useState } from "react"
import useModalCloser from "@/app/lib/useModalCloser";
import PortalContainer from "../PortalContainer/PortalContainer";

export type TDropDownProps = {
  children: ReactElement,
  anchor: HTMLElement,
  closeCallback: ()=>void,
  dir: "left"|"right"
}

export default function ({children,anchor,closeCallback, dir}:TDropDownProps) {
 
  if(!anchor) return ; 
  const aPos = anchor.getBoundingClientRect(),
        leftSide = aPos.left < (window.innerWidth / 2) - anchor.offsetWidth && dir !== "right",
        topSide = aPos.top < (window.innerHeight / 2) - anchor.offsetHeight
  const boxRef = useRef<HTMLDivElement>(null)
  const position = {
    top: aPos.top + anchor.offsetHeight + 4,
    left: dir == "left"  ? aPos.left : undefined,
    bottom: undefined,
    right: dir == "right" ? window.innerWidth - aPos.right : undefined
  }
  const [dPos,updatedPos] = useState<{
    top:number|undefined,
    left:number|undefined,
    bottom:number|undefined,
    right:number|undefined
  }>(position);

  

  
  
  //Update positioning to keep in bounds 
  useLayoutEffect(()=> {
    if(!boxRef || !boxRef.current || !boxRef.current.offsetWidth) return ;
    const pos = boxRef.current.getBoundingClientRect(); 

    console.log(pos.right);
    
    updatedPos(prev => {
      const updated = {...prev};
      if(pos.left < 0) {
        updated.left = aPos.left; 
        updated.right = undefined;
      }
      if(pos.right >= window.innerWidth) {
        updated.left = undefined;
        updated.right = window.innerWidth - aPos.right
      }
      if(pos.bottom >= window.innerHeight) {
        updated.top = undefined;
        updated.bottom = window.innerHeight - aPos.bottom + anchor.offsetHeight + 4
      }
      
      
      return updated;
    })

  },[boxRef])
  
 useLayoutEffect(()=> {
  
   
    const closeScroll = () => {
      closeCallback(); 
    }
   
    window.addEventListener("scroll",closeScroll)
    window.addEventListener("resize",closeScroll)
    return () => {
      console.log("removed");
      window.removeEventListener("scroll",closeScroll);
    
      window.removeEventListener("resize",closeScroll)
    }
  },[])
  const closer = useModalCloser(closeCallback, "dropDown", boxRef)
  if(!closer) return ; 

  return <PortalContainer>
      <div ref={boxRef} style={dPos} className={`${styles.dropdown} z-dropdown ${closer.isTop?"z-interactive-top":""}`}>
        {children}
      </div>
   </PortalContainer>
}