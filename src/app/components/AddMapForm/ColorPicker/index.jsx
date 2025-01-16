import styles from "./ColorPickerStyles.module.css"
import { useRef,useEffect } from "react";


export default function ColorPicker({selectCallback,cancelCallback,currentColor}) {
  const possibleColors = process.env.NEXT_PUBLIC_LAYER_COLORS.split(",");

  const outsideClickRef=useRef(null)

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
     if(!outsideClickRef) return 
    function handleClickOutside(event) {
      if (outsideClickRef.current && !outsideClickRef.current.contains(event.target)) {
        cancelCallback(); 
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [outsideClickRef]);

  const colorPicked = (color) => {
    selectCallback(color);
    cancelCallback();
  }
  

  return <div className={`${styles.container}  big-drop-shadow`} ref={outsideClickRef}>
  {possibleColors.map(c=> {
    return <button onClick={(e) => {
      e.preventDefault();
      colorPicked(c);
    }} className={`${styles.button} ${c == currentColor ? styles.selected:""}`} style={{background:c}} key={c}></button>
  })}
 
  
  </div>

}