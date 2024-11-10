import { createElement } from "react"
import utilStyles from "../../lib/utilities.module.css"
import styles from "./styles.module.css";
const Button = (props) => {
  const {children,icon,onClick,link=false,modifiers=[],style,url} = props
  const modClasses = modifiers.map(m=>styles[m]).join(" ")
  const attributes = {
    href : link ? url : undefined,
    target : link ? "_blank" : undefined,
    onClick : onClick || undefined,
    className: `${utilStyles["flex-center"]} ${styles.button} ${modClasses}`,
    style : style || undefined
  }
  return createElement(link?"a":"button",attributes,<>{icon && <span className={`${styles.icon}`}>{icon}</span>}
        {children}</>)
}

export default Button; 