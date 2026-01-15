import { ReactElement, SyntheticEvent } from "react"
import styles from "./DropDownStyles.module.css"

export type TDropDownItemProps = {
  icon?:ReactElement,
  onClick: ()=>void,
  children:ReactElement|string,
  state?: "disabled"|"caution"
  mobile?:boolean
}

export default function({icon,onClick,children,state,mobile}:TDropDownItemProps) {


  return <button disabled={state == "disabled"} onClick={onClick} className={`${styles.dropDownItem} ${mobile ? styles.mobile: ""} ${state? styles[state]:""} flex-center `}>
  {icon && <span className={styles.dropDownItemIcon}>{icon}</span>} 
  <span className={`${styles.dropDownItemLabel}`}>{children}</span>
  {state == "disabled" && <span className={`${styles.disabledOverlay} polka`} />}
  </button>
}