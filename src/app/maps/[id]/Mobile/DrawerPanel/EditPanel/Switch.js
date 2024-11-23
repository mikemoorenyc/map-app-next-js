import { Check } from "iconoir-react"
import styles from "./Switch.module.css"

export default function Switch({on,valueKey,label,valueChanger}) {
  const changeState = (e) => {
    e.preventDefault(); 
    valueChanger(!on , valueKey)
  }
  const onClass= on ? styles.on : ""
  return <button onClick={changeState} type="button" className={`${styles.container} flex-center-center`}>
    <div className={`${styles.label} flex-1`}>{label}</div>
    <div className={`${styles.switch} border-1 ${onClass}`} >
      <div className={`${styles.nub} border-1 ${onClass} flex-center-center`} > 
      {on && <Check width={14} height={14} />}
      </div>
    </div>
  </button>

}