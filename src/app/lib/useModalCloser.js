import { useState,useContext,useLayoutEffect, useRef ,useEffect, useCallback} from "react";

import ModalContext from "../contexts/ModalContext";

export default function useModalCloser(closeFunction,id,customRef) {
 const defaultRef = useRef(null);
 const modal = useContext(ModalContext);
  const { setActive, removeActive, getTop } = modal;

  const ref = customRef || defaultRef ; 
 useEffect(()=> {
   setActive(id);
    return () => removeActive(id);
 },[]);

useEffect(() => {
    const handleClick = (e) => {
     
      const isTop = getTop() === id;

      if (isTop && ref.current && !ref.current.contains(e.target)) {
        closeFunction(); 
      } else if (ref.current && ref.current.contains(e.target)) {
        // Move back to top if user interacts again
        setActive(id);
      }
    };
    const escapePress = (e) => {
      if(e.code !== "Escape") return ; 
      const isTop = getTop() == id; 
      if(isTop) {
        closeFunction(); 
      }
    }
    window.addEventListener("keydown",escapePress);
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('mousedown', handleClick); window.removeEventListener("keydown",escapePress)
    }
  }, [ref, id, closeFunction, getTop]);




 return ref; 
}