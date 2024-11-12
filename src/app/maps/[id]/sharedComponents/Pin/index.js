import DataContext from "@/app/contexts/DataContext";
import styles from "./styles.module.scss"
import { useContext } from "react";
import { Star } from "iconoir-react";

const Pin = (props) => {
  const {layerData} = useContext(DataContext)
  const {size, interactable, highlighted,className} = props;
  if(!layerData.length || !layerData?.pins) {
    return ; 
  }
  const p = layerData.map(layer => layer.pins).flat().find(pin => pin.id == pId);
  if(!p) return ; 
  const layer =layerData.filter(layer => layer.id == p.layerId)[0];
  let dim = size || 10;
  dim = dim * (18/10);
  dim = 2 * Math.round(dim / 2);
  const hasIcon = p?.icon ? true : false 
  const icon = p?.icon || p.name.charAt(0);
  const lightOrDark = layer?.lightOrDark;
  let textShadowStyles = null;
  if(hasIcon) {
    const color = lightOrDark == dark ? "white" : "black"
    textShadowStyles = `text-shadow: .5px .5px 0 ${color}, -.5px -.5px 0 ${color}, .5px -.5px 0 ${color}, -.5px .5px 0 ${color};`
  }
  
  const inlineStyles = {
    backgroundColor : layer?.color || "#ffffff",
    fontSize: size ||10,
    width: dim,
    height: dim,
    transform: !interactable ? "none" : "",
    pointerEvents : !interactable ? "none" : "",
    textShadow: textShadowStyles
  }




  return <div 
    className={`${styles.pin} ${styles[lightOrDark]} ${highlighted?styles.highlighted:""} ${className || ""}`}
    style={inlineStyles}
    data-id={p?.id}
    >
      <span>{icon}</span>
      {p?.favorited && <Star className={styles.favoriteStar} />}


  </div>

}
export default Pin; 