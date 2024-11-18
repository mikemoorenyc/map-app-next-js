import { GoogleCircle } from "iconoir-react";
import { auth,signIn,signOut } from "../auth"
import Button from "../components/Button";
import styles from "./page.module.css"

export default async function Page() {
 const session = await auth();
 

  return <div className={styles.formContainer}><div className={`${styles.formInner} border-1 big-drop-shadow round-border`}>
  {session && <div >
    <div className={styles.signedInHeader}>Signed in as:</div> 
    <div className={`flex-center-center`}>
      <img className={styles.userImg} src={session.user.image} /> <span className={styles.userName}>{session.user.email}</span>
    </div>
    <form className={`${styles.buttonContainer} flex-center-center`}
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button type={"submit"}>Sign out</Button>
    </form>
  
  </div>}
  {!session &&<div><div className={styles.signedInHeader}>Sign in to our map app</div> <form className={`${styles.buttonContainer} flex-center-center`}
      action={async () => {
        "use server"
        await signIn("google",{ redirectTo: "/" })
      }}
    >
      <Button type={"submit"} icon={<GoogleCircle />}>Sign in with Google</Button>
    </form></div>}
    
  
  </div></div>
}

/*
   <form
      action={async () => {
        "use server"
        await signIn("google",{ redirectTo: "/" })
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
    */