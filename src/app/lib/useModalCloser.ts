import { useContext, useRef ,useEffect,  RefObject, } from "react";

import ModalContext from "../contexts/ModalContext";

export default function useModalCloser(closeFunction:()=>void,id:number|string,customRef?:RefObject<HTMLDivElement|null>) {
 const defaultRef = useRef<HTMLDivElement>(null);
 const modal = useContext(ModalContext);
  const { setActive, removeActive, getTop } = modal;
  if(customRef === null)return ;
  
  const ref = customRef || defaultRef ; 
  if(!ref) return ; 
 useEffect(()=> {
   setActive(id);

    return () => removeActive(id);
 },[]);

useEffect(() => {
    const handleClick = (e:MouseEvent) => {

      if(!e) return ; 

      const isTop = getTop() === id;

      if (isTop && ref.current &&  e.target instanceof Node && !ref.current.contains(e.target)) {

        closeFunction(); 
      } else if (ref.current && e.target instanceof Node &&  ref.current.contains(e.target)) {
        // Move back to top if user interacts again
        setActive(id);

      }
    };
    const escapePress = (e:KeyboardEvent) => {
      
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


 const isTop :boolean = getTop() === id; 

 return {ref,isTop}; 
}
