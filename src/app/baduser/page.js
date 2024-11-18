import { signOut } from "../auth"


export default () => {
  <div>
  You're not allowed to use this site!
  <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  </div>
}