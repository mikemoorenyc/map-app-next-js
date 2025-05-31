import { RiPaintFill } from "@remixicon/react";
import styles from "./ColorPickerStyles.module.css"




export default function ColorPicker({selectCallback,cancelCallback,currentColor}) {
  const possibleColors = process.env.NEXT_PUBLIC_LAYER_COLORS.split(",");

 

  const colorPicked = (color) => {
    selectCallback(color);
    cancelCallback();
  }
  const isCustom = !possibleColors.includes(currentColor);
  console.log(isCustom);

  return <div className={`${styles.container} `} >
  {possibleColors.map(c=> {
    return <button onClick={(e) => {
      e.preventDefault();
      colorPicked(c);
    }} className={`${styles.button} ${c == currentColor ? styles.selected:""}`} style={{background:c}} key={c}></button>
  })}

 
  
  </div>

}

/*

useEffect(() => {
    
     // Alert if clicked on outside of element
     
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

  
  
  */