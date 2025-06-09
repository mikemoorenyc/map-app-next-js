import { useContext,memo, useCallback } from "react"
import styles from "./Header.module.css"
import MapIcon from "./MapIcon"
import Button from "@/app/components/Button"
import MapTitle from "./MapTitle"

import DataContext from "@/app/contexts/DataContext"

import { RiStackLine } from "@remixicon/react"

const MapIconMemo = memo(MapIcon);

const Header = ({id}) => {
  
  const {layerDispatch,mapIcon,updateMapIcon} = useContext(DataContext);
  
  


  return <div className={`${styles.header} flex-center`}>
  <MapIconMemo mapIcon={mapIcon} updateMapIcon={updateMapIcon} />
    <MapTitle />
   
         
            <Button icon={<RiStackLine/>} onClick={(e)=>{e.preventDefault();layerDispatch({type:"ADDED_LAYER"})}}   modifiers={["sm","ghost"]}>
                    Add layer
            </Button>
   
  </div>
}

export default Header; 

//onClick={addLayer}  