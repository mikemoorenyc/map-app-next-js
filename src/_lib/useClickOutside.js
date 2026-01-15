import {useLayoutEffect,useRef} from "react"

export default function useClickOutside (closeFunction) {
  const ref = useRef(null);
  
  useLayoutEffect(()=> {
    console.log(ref);
    if(!ref) return ; 
    const clickOutside = (e) => {
      console.log(e);
       if (!ref.current.contains(e.target) ){
       closeFunction(); 
       return false; 
      }
    }
    setTimeout(()=>{
      window.addEventListener("click",clickOutside); 
    },10)
    return () => {
      window.removeEventListener("click",clickOutside); 
    }
  },[ref])

  return ref; 

}
