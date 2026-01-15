import { CSSProperties, ReactNode } from "react"
import styles from "./styles.module.css"
type TProps = {
  style?:CSSProperties,
  primaryButtons:ReactNode,
  secondaryButtons?:ReactNode
}
const ActionBar = (props:TProps) => {
  const {style={}, primaryButtons,secondaryButtons} = props

  return <div className={`${styles.actionBar} flex-center`} style={style}>
    <div className={`${styles.buttonContainer} ${styles.primaryButtons} flex-center flex-1`}>
      {primaryButtons}
    </div>
    {secondaryButtons && <div className={`${styles.buttonContainer} flex-center`}>
      {secondaryButtons}
    </div>}
  </div>
}
export default ActionBar