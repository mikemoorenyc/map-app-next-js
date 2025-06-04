import {useLayoutEffect} from "react"

export default function useClickOutside (ref, closeFunction) {
  useLayoutFunction(()=> {
    const clickOutside = (e) => {
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
  },[])

}
