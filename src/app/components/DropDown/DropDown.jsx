import { createPortal } from "react-dom"
import styles from "./DropDownStyles.module.css"
import { useLayoutEffect,useRef,useState } from "react"
export default function ({children,anchor,closeCallback, dir}) {
  if(!anchor) return ; 
  const aPos = anchor.getBoundingClientRect(),
        leftSide = aPos.left < (window.innerWidth / 2) - anchor.offsetWidth && dir !== "right",
        topSide = aPos.top < (window.innerHeight / 2) - anchor.offsetHeight
  const boxRef = useRef(null)
  const position = {
    top: aPos.top + anchor.offsetHeight + 4,
    left: dir == "left"  ? aPos.left : undefined,
    bottom: undefined,
    right: dir == "right" ? window.innerWidth - aPos.right : undefined
  }
  const [dPos,updatedPos] = useState(position);
  
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
  
    const closeCheck = (e) => {
     
      console.log("click check");
   
      
      if (!boxRef.current.contains(e.target)){
        console.log("close");
       closeCallback(); 
       return ; 
      }

    }
    const closeScroll = () => {
      closeCallback(); 
    }
    setTimeout(()=> {
      console.log("added")
      window.addEventListener("click",closeCheck);
    },500)
    window.addEventListener("scroll",closeScroll)
    window.addEventListener("resize",closeScroll)
    return () => {
      console.log("removed");
      window.removeEventListener("scroll",closeScroll);
      window.removeEventListener('click',closeCheck);
      window.removeEventListener("resize",closeScroll)
    }
  },[])
  return <>
    {createPortal(
      <div ref={boxRef} style={dPos} className={styles.dropdown}>
        {children}
      </div>,
      document.getElementById("portal-container")
    )}
  </>
}