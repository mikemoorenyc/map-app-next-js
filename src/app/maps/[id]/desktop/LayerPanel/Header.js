import { useContext,memo, useEffect ,useState} from "react"
import styles from "./Header.module.css"
import MapIcon from "./MapIcon"
import Button from "@/app/components/Button"
import MapTitle from "./MapTitle"


import DataContext from "@/app/contexts/DataContext"
import ActiveContext from "@/app/contexts/ActiveContext"
import { RiStackLine } from "@remixicon/react"

const MapIconMemo = memo(MapIcon);

const Header = ({id,layerRef}) => {
  const [newId,updateNewId] = useState(null);
  const {layerDispatch,mapIcon,updateMapIcon,user,layerData} = useContext(DataContext);
  const {activeDispatch} = useContext(ActiveContext);
  
  useEffect(()=> {
    if(!layerData.length) return ; 
    if(layerData[layerData.length - 1].id == newId) {
      setTimeout(()=> {
        layerRef.current.scrollTop = layerRef.current.scrollHeight;
      },50)
      activeDispatch({
        type: "ACTIVE_LAYER",
        id: newId
      })
      updateNewId(null);
    }
  },[layerData])


  return <div className={`${styles.header} flex-center`}>
  <MapIconMemo mapIcon={mapIcon} updateMapIcon={updateMapIcon} />
    <MapTitle />
   
         
            <Button icon={<RiStackLine/>} onClick={(e)=>{
              e.preventDefault();
              const id = Date.now();
              updateNewId(id)
              layerDispatch({type:"ADDED_LAYER",user:user||null,id:id})
          
              }}   modifiers={["sm","ghost"]}>
                    Add layer
            </Button>
   
  </div>
}

export default Header; 

//onClick={addLayer}  