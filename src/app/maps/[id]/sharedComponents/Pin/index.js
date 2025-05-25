
import styles from "./styles.module.css"

import { Star } from "iconoir-react";

const Pin = (props) => {
  
  const {size, interactable, highlighted,className,pin,layer} = props;
  if(!pin) return ; 
  

    
  

 
  let dim = size || 10;
  dim = dim * (18/10);
  dim = 2 * Math.round(dim / 2);
  const hasIcon = pin?.icon ? true : false 
  const icon = pin?.icon || pin.title.charAt(0);
  const lightOrDark = layer?.lightOrDark;
  let textShadowStyles = null;
  if(hasIcon) {
    const color = lightOrDark == "dark" ? "white" : "black"
    textShadowStyles = `.5px .5px 0 ${color}, -.5px -.5px 0 ${color}, .5px -.5px 0 ${color}, -.5px .5px 0 ${color}`
  }
  
  const inlineStyles = {
    backgroundColor : !pin.favorited? layer?.color || "#ffffff":undefined,
    fontSize: size ||10,
    width: dim,
    height: dim,
    transform: !interactable ? "none" : "",
    pointerEvents : !interactable ? "none" : "",
    textShadow: textShadowStyles,
    filter: pin?.visited ? "grayscale(1)" : ""
  }




  return <div 
    className={`${styles.pin} ${styles[lightOrDark]} ${highlighted?styles.highlighted:""} ${className || ""} ${pin.favorited?styles.favorited:""}`}
    style={inlineStyles}
    data-id={pin.id}
    >
      {pin.favorited && <svg className={`${styles.starShape} ${styles[lightOrDark]}`} style={{animation: pin?.visited? "none":undefined}} viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 1L22.4498 5.30479L28.5801 4.43769L29.6498 10.5359L35.119 13.4377L32.4 19L35.119 24.5623L29.6498 27.4641L28.5801 33.5623L22.4498 32.6952L18 37L13.5502 32.6952L7.41987 33.5623L6.35015 27.4641L0.880983 24.5623L3.6 19L0.880983 13.4377L6.35015 10.5359L7.41987 4.43769L13.5502 5.30479L18 1Z" fill={layer?.color || "#ffffff"} stroke="#FF1717" strokeLinejoin="round"/>
</svg>}
      <span style={{position:"relative"}}>{icon}</span>
      


  </div>

}
//
export default Pin; 

//{pin.favorited && <Star className={styles.favoriteStar} style={{display:"none",animation: pin?.visited? "none":undefined}}/>}