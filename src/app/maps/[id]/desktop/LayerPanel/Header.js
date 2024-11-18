import { useContext } from "react"
import styles from "./Header.module.css"

import Button from "@/app/components/Button"
import MapTitle from "./MapTitle"

import DataContext from "@/app/contexts/DataContext"
import { PlusCircle } from "iconoir-react"

const Header = ({id}) => {
  
  const {layerDispatch} = useContext(DataContext);
  

  return <div className={`${styles.header} flex-center`}>
    <MapTitle />
   
         
            <Button icon={<PlusCircle/>} onClick={(e)=>{e.preventDefault();layerDispatch({type:"ADDED_LAYER"})}}   modifiers={["sm","ghost"]}>
                    Add layer
            </Button>
   
  </div>
}

export default Header; 

//onClick={addLayer}  