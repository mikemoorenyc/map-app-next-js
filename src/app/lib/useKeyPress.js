import {useEffect} from "react"

export default function useKeyPress(key,action) {
  
  useEffect(()=> {
    if(!action) return ; 
    const clickTrack = (e) => {
     console.log(e.code)
        if(e.code === key) {
          action(); 
        }
      
    }
    window.addEventListener("keydown",clickTrack);
    return () => {
      window.removeEventListener("keydown",clickTrack); 
    }
  },[action])
  return null; 
}
