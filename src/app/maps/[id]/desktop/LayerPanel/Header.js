'use client'
import { useContext,memo, useEffect ,useState} from "react"
import styles from "./Header.module.css"
import MapIcon from "./MapIcon"
import Button from "@/app/components/Button"
import MapTitle from "./MapTitle"
import { ClientSideSuspense } from "@liveblocks/react"
import { RiEmojiStickerLine } from "@remixicon/react"
import DataContext from "@/app/contexts/DataContext"
import ActiveContext from "@/app/contexts/ActiveContext"
import { RiStackLine } from "@remixicon/react"
import useLiveEditing from "@/app/lib/useLiveEditing"

const MapIconMemo = memo(MapIcon);


const Header = ({id,layerRef}) => {
  const dispatchEvent = useLiveEditing()
  const [newId,updateNewId] = useState(null);
  const {layerDispatch,mapIcon,updateMapIcon,user,layerData,pageTitle} = useContext(DataContext);
  const {activeDispatch,activeData} = useContext(ActiveContext);
  const {canEdit} = activeData
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
  
  <MapIconMemo {...{canEdit,mapIcon,updateMapIcon}} />
    <MapTitle {...{canEdit}} />
   
         
          { <Button icon={<RiStackLine/>} onClick={(e)=>{
              e.preventDefault();
              const id = Date.now();
              updateNewId(id)
              dispatchEvent({type:"ADDED_LAYER",user:user||null,id:id})
          
              }}   modifiers={["sm","ghost", !canEdit?"disabled":""]}>
                    Add layer
            </Button>}
   
  </div>
}

const FallBack = () => {
  const {pageTitle} = useContext(DataContext);
  return<div className={`${styles.header} flex-center`}>
    <div style={{marginRight:8}} >
      <div className={`${styles.editMapIconButton}`}>
        <RiEmojiStickerLine className={styles.mapIcon} width={24} height={24}/>
      </div>
    </div>
    <div  className={`${styles.title} ${styles.start} overflow-ellipsis flex-1`}>
        {pageTitle}
    </div>
  </div>
}

export default (props)=><ClientSideSuspense fallback={<FallBack/>}><Header {...props}/></ClientSideSuspense>; 

//onClick={addLayer}  