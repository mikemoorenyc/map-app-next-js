import {useEffect} from "react"

export default function useKeyPress(key,action) {
  useEffect(()=> {
    const clickTrack = (e) => {
     
        if(e === key) {
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
