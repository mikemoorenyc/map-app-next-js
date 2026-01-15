import { RiPaintFill } from "@remixicon/react";
import styles from "./ColorPickerStyles.module.css"
import {useState,Suspense,lazy} from "react"
import lightOrDark from "@/_lib/lightOrDark";
type TProps = {
  selectCallback: (c:string) => void,
  cancelCallback: ()=>void,
  currentColor:string, 
}

const CustomColorPicker = lazy(()=> import("./CustomColorPicker"));

export default function ColorPicker({selectCallback,cancelCallback,currentColor}:TProps) {
  if(!process.env.NEXT_PUBLIC_LAYER_COLORS)return false; 
  const possibleColors = process.env.NEXT_PUBLIC_LAYER_COLORS.split(",");
  if(!possibleColors) return false; 
  const [customColorOpen, updateCustomColorOpen] = useState(false);
  const isCustom = !possibleColors.includes(currentColor);
  const customColor = isCustom ? currentColor : "#ffffff"
  const customLD = lightOrDark(customColor);

  const colorPicked = (color:string) => {
    selectCallback(color);
    cancelCallback();
  }
 
  console.log(isCustom);

  return (
    <div className={`${styles.container}`}>
      {!customColorOpen && (
        <>
          {possibleColors.map((c) => (
            <button
              onClick={(e) => {
                e.preventDefault();
                colorPicked(c);
              }}
              className={`${styles.button} ${c === currentColor ? styles.selected : ""}`}
              style={{ background: c }}
              key={c}
            />
          ))}
          <button
            className={`${styles.button} ${isCustom ? styles.selected : ""} ${styles.customButton}`}
            style={{ background: customColor }}
            onClick={(e) => {
              updateCustomColorOpen(true);
            }}
          >
            <RiPaintFill className={styles.paintIcon} color={customLD == "dark"?"white": "black"}/>
          </button>
        </>
      )}
      {customColorOpen && (
        <Suspense fallback={<div style={{height:268}}></div>}>
          <CustomColorPicker currentColor={currentColor} updateFunction={colorPicked} closeFunction={()=>{updateCustomColorOpen(false)}}/>
        </Suspense>
      )}
    </div>
  );

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