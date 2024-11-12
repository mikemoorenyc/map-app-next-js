import { useContext } from "react"
import styles from "./Header.module.css"

import Button from "@/app/components/Button"
import MapTitle from "./MapTitle"
import Updater from "./Updater"
import DataContext from "@/app/contexts/DataContext"
import { PlusCircle } from "iconoir-react"

const Header = ({id}) => {
  
  const {layerDispatch} = useContext(DataContext);
  

  return <div className={styles.header}>
    <MapTitle />
    <div className={styles.sub}>
            <Updater />
            <Button icon={<PlusCircle/>} onClick={(e)=>{e.preventDefault();layerDispatch({type:"ADDED_LAYER"})}}   modifiers={["sm","ghost"]}>
                    Add layer
            </Button>
    </div>
  </div>
}

export default Header; 

//onClick={addLayer}  