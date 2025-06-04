import {useEffect} from "react"

export default function useKeyPress(toTrack) {
  useEffect(()=> {
    const clickTrack = (e) => {
      toTrack.forEach((t) => {
        if(e === t[0]) {
          t[1](); 
        }
      }
    }
    window.addEventListener("keydown",clickTrack);
    return () => {
      window.removeEventListener("keydown",clickTrack); 
    }
  },[])
  return null; 
}
