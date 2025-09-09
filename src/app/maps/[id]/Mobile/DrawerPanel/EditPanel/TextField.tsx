import { ReactNode } from "react"
import styles from "./EditPanel.module.css"

type TProps= {
  children:ReactNode,
  label?:string,
  name:string
}

export default function TextField({ label, name,children}:TProps) {

  return <div className={`${styles.textFieldContainer} ${!label ? styles.noLabel : ""}`}>
    {label && <label className={`${styles.textFieldLabel}`} htmlFor={name}>{label}</label>}
    {children}
  </div>

}