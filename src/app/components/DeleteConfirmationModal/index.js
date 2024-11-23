import styles from "./styles.module.css"
import Button from "../Button"


export default function DeleteConfirmationModal({deleteClick,cancelClick,title}) {
  return <div className='LayerEdit-delete-confirm' style={{width:350}}>
      <div className={`${styles.deleteQuestion} `}>{title}</div>
      <div className={`${styles.deleteButtons} flex-center-center`}>
          <Button modifiers={["secondary"]} onClick={cancelClick} >No...</Button>
          <Button modifiers={["caution"]} onClick={deleteClick} >Yes, delete it</Button>
      </div>
    </div>
}