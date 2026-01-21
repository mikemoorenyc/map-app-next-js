import { CSSProperties, ReactElement, SyntheticEvent,ReactNode } from "react";
import utilStyles from "../../lib/utilities.module.css"
import styles from "./styles.module.css";
import Link from "next/link";

export type TButtonProps = {
  children?: ReactNode,
  icon?: ReactNode,
  type?: "button"|"submit",
  onClick?: (e:SyntheticEvent)=>void,
  modifiers?: TModOptions[],
  className?:string,
  style?: CSSProperties,
  href?:string, 
  target?:string
}
export type TModOptions = ("bigger"|"disabled"|"secondary"|"sm"|"ghost"|"raised"|"round"|"pill"|"caution"|"big"|"FAB"|"md"|"icon"|"xs")


const Button = (props:TButtonProps) => {
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
    type: type
  }
  


  const inner = <>
    {icon && <span className={`${styles.icon} ${!children? styles.noText : ""}`}>{icon}</span>}
    {children}
    {isDisabled && <span className={`${styles.disabledFill} ${disabledClass}`} />}
  </>
  let safeUrl ;
  if(href && typeof href =="string") {
    safeUrl = href; 
  }

  if(safeUrl) {
    return <Link {...{...attributes,...{href:safeUrl}}}>{inner}</Link>
  }
 
  return <button disabled={isDisabled} {...attributes}>{inner}</button>
}

export default Button; 