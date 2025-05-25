import styles from "./DropDownStyles.module.css"

export default function({icon,onClick,children,state,mobile}) {


  return <button disabled={state == "disabled"} onClick={onClick} className={`${styles.dropDownItem} ${mobile ? styles.mobile: ""} ${state? styles[state]:""} flex-center `}>
  {icon && <span className={styles.dropDownItemIcon}>{icon}</span>} 
  <span className={`${styles.dropDownItemLabel}`}>{children}</span>
  {state == "disabled" && <span className={`${styles.disabledOverlay} polka`} />}
  </button>
}