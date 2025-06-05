import {useEffect} from "react"

export default function useKeyPress(key,action) {
  
  useEffect(()=> {
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
  },[])
  return null; 
}
