import styles from "./styles.module.css"

const ActionBar = (props) => {
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