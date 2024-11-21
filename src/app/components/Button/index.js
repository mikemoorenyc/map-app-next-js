import { createElement } from "react"
import utilStyles from "../../lib/utilities.module.css"
import styles from "./styles.module.css";
import Link from "next/link";
const Button = (props) => {
  const {children,icon,type="button",onClick=undefined,modifiers=[],className="",style=undefined,href=undefined,target=undefined} = props
  
  const classString = `${utilStyles["flex-center"]} ${styles.button} ${modifiers.map(m=>styles[m]).join(" ")} ${className}`
  const attributes = {
    href : href,
    target : target,
    onClick : onClick,
    className: classString,
    style : style ,
   
  }

  const inner = <>
    {icon && <span className={`${styles.icon} ${!children? styles.noText : ""}`}>{icon}</span>}
    {children}
  </>



  if(href) {
    return <Link {...attributes}>{inner}</Link>
  }
  attributes.type=type; 
  return <button {...attributes}>{inner}</button>
}

export default Button; 