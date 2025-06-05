import {  useRef ,useContext,useLayoutEffect,useEffect, useCallback} from "react"
import ActiveContext from "../contexts/ActiveContext";
import React from "react";


export default function ({children,closeEvent,id= +new Date()}) {

  const {activeData,activeDispatch} = useContext(ActiveContext);
  const currentState = useRef(id);
  const previousState = useRef(activeData.activeModal);
  const ref = useRef(null);
  const activeModal = activeData.activeModal;

  useEffect(()=> {
    activeDispatch({type:"UPDATE_ACTIVE_MODAL",id: id})
    console.log("opened"+id)
    return () => {
      activeDispatch({type:"UPDATE_ACTIVE_MODAL",id:previousState.current})
    }
  },[])

  useEffect(()=> {
    if(activeModal !== currentState.current) return ; 
    const clickTrack = (e) => {
     console.log(e.code)
        if(e.code === "Escape") {
          closeEvent()
        }
      
    }
    window.addEventListener("keydown",clickTrack);
    return () => {
      window.removeEventListener("keydown",clickTrack); 
    }
  },[activeModal])

  const checker = useCallback((e) => {
    console.log("checker"+activeModal);
    console.log(currentState.current)
    return !ref.current.contains(e.target) && activeModal == currentState.current
  },[activeModal])

  useLayoutEffect(()=> {
    
    if(!ref || activeModal !== currentState.current) return ; 

    const clickOutside = (e) => {
      e.stopPropagation(); 
      
      setTimeout(async ()=> {
        console.log(activeModal,currentState.current, previousState.current)
       if (checker(e) ){
       closeEvent(); 
       return false; 
      }
      },200)
      
    }
    setTimeout(()=>{
      window.addEventListener("click",clickOutside); 
    },10)
    return () => {
      window.removeEventListener("click",clickOutside); 
    }
  },[ref,activeModal])





 return <div>{React.Children.map(children, (child) =>
        React.cloneElement(child, { containerRef: ref })
      )}
 </div>

}