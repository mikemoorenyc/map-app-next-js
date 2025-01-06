
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
    backgroundColor : layer?.color || "#ffffff",
    fontSize: size ||10,
    width: dim,
    height: dim,
    transform: !interactable ? "none" : "",
    pointerEvents : !interactable ? "none" : "",
    textShadow: textShadowStyles,
    filter: pin?.visited ? "grayscale(1)" : ""
  }




  return <div 
    className={`${styles.pin} ${styles[lightOrDark]} ${highlighted?styles.highlighted:""} ${className || ""}`}
    style={inlineStyles}
    data-id={pin.id}
    >
      <span>{icon}</span>
      {pin.favorited && <Star className={styles.favoriteStar} style={{animation: pin?.visited? "none":undefined}}/>}


  </div>

}
export default Pin; 