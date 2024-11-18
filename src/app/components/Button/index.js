import { createElement } from "react"
import utilStyles from "../../lib/utilities.module.css"
import styles from "./styles.module.css";
import Link from "next/link";
const Button = (props) => {
  const {children,icon,onClick,type,link=false,modifiers=[],className,style,url,internalLink=false} = props
  
  const classString = `${utilStyles["flex-center"]} ${styles.button} ${modifiers.map(m=>styles[m]).join(" ")} ${className || ""}`
  const attributes = {
    href : link ? url : undefined,
    target : link && !internalLink ? "_blank" : undefined,
    onClick : onClick || undefined,
    className: classString,
    style : style || undefined,
   
  }
  const iconHTML = icon ? <span className={`${styles.icon} ${!children? styles.noText : ""}`}>{icon}</span> : null; 
  if(link) {
    return <Link
    href={url}
    target={!internalLink ?"_blank": undefined}
    style={style || undefined}
    className={classString}
    >
    {iconHTML}
    {children}
    </Link>
  }
  return createElement(link?"a":"button",attributes,<>{icon && iconHTML}
        {children}</>)
}

export default Button; 