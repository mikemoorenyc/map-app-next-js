import { useContext } from "react"
import styles from "./Header.module.css"
import { PlusCircle } from "@/app/components/icons"
import Button from "@/app/components/Button"
import MapTitle from "./MapTitle"
import Updater from "./Updater"

const Header = ({id}) => {

  return <div className={styles.header}>
    <MapTitle />
    <div className={styles.sub}>
            <Updater />
            <Button icon={<PlusCircle/>} onClick={(e)=>{e.preventDefault();console.log("click")}}   modifiers={["sm","ghost"]}>
                    Add layer
            </Button>
    </div>
  </div>
}

export default Header; 

//onClick={addLayer}  