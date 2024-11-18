import { signOut } from "../auth"
import styles from "../login/page.module.css"
import Button from "../components/Button"

export default () => {
  return <div  className={styles.formContainer}><div className={`${styles.formInner} border-1 big-drop-shadow round-border`}>
    <div className={styles.signedInHeader}>You're not allowed to use this website! Get outta here! </div> 
  
    <form className={`${styles.buttonContainer} flex-center-center`}
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button type={"submit"}>Sign out</Button>
    </form>
  
  </div></div>
}