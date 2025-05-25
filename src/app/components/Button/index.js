import { createElement } from "react"
import utilStyles from "../../lib/utilities.module.css"
import styles from "./styles.module.css";
import Link from "next/link";
const Button = (props) => {
  const {children,icon,type="button",onClick=undefined,modifiers=[],className="",style=undefined,href=undefined,target=undefined} = props
  const isDisabled = modifiers.includes("disabled");

  let disabledClass = "";
  if(isDisabled) {
    disabledClass = "stripes-bg-on-transparent"
  }
  if(isDisabled && modifiers.includes("secondary")) {
    disabledClass = "stripes-text-on-transparent"
  }

  const classString = `${utilStyles["flex-center"]} ${styles.button} ${modifiers.map(m=>styles[m]).join(" ")} ${className} ${disabledClass}`
  const attributes = {
    href : href,
    target : target,
    onClick : onClick,
    className: classString,
    style : style ,
   
  }
  
  console.log(isDisabled);

  const inner = <>
    {icon && <span className={`${styles.icon} ${!children? styles.noText : ""}`}>{icon}</span>}
    {children}
    {isDisabled && <span className={`${styles.disabledFill} ${disabledClass}`} />}
  </>



  if(href) {
    return <Link {...attributes}>{inner}</Link>
  }
  attributes.type=type; 
  return <button disabled={isDisabled} {...attributes}>{inner}</button>
}

export default Button; 