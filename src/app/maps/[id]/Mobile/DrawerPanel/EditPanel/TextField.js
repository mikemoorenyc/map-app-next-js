import styles from "./EditPanel.module.css"

export default function TextField({type="text",value,updateValue, label, name,children}) {

  return <div className={`${styles.textFieldContainer} ${!label ? styles.noLabel : ""}`}>
    {label && <label className={`${styles.textFieldLabel}`} htmlFor={name}>{label}</label>}
    {children}
  </div>

}