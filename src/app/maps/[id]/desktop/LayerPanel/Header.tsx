'use client'
import { useContext,memo, useEffect ,useState, RefObject} from "react"
import styles from "./Header.module.css"
import MapIcon from "./MapIcon"
import Button, { TModOptions } from "@/app/components/Button"
import MapTitle from "./MapTitle"
import { ClientSideSuspense } from "@liveblocks/react"
import { RiEmojiStickerLine } from "@remixicon/react"
import DataContext from "@/app/contexts/DataContext"
import ActiveContext from "@/app/contexts/ActiveContext"
import { RiStackLine } from "@remixicon/react"
import useLiveEditing from "@/app/lib/useLiveEditing"
import addDisabledMod from "@/app/lib/addDisabledMod"
import useLayerData from "@/app/lib/useLayerData"

type TProps = {
  layerRef: RefObject<HTMLDivElement|null>
}

const MapIconMemo = memo(MapIcon);


const Header = ({layerRef}:TProps) => {
  
  const dispatchEvent = useLiveEditing()
  const [newId,updateNewId] = useState<null|number>(null);
  const {layerDispatch,user} = useContext(DataContext);
  const {activeDispatch,activeData} = useContext(ActiveContext);
  const {canEdit} = activeData
  const {pageTitle,layers,mapIcon} = useLayerData()
  const layerData = layers;
  useEffect(()=> {
    if(!layerRef||!layerRef?.current) return ;
    if(!layerData.length) return ; 
    if(layerData[layerData.length - 1].id == newId) {
      setTimeout(()=> {
        if(!layerRef||!layerRef?.current) return ;
        layerRef.current.scrollTop = layerRef.current.scrollHeight;
      },50)
      activeDispatch({
        type: "ACTIVE_LAYER",
        id: newId
      })
      updateNewId(null);
    }
  },[layerData,layerRef])

  
  let mods :TModOptions[] = addDisabledMod(["sm","ghost"],!canEdit);

  return <div className={`${styles.header} flex-center`}>
  
  <MapIconMemo {...{canEdit,mapIcon}} />
    <MapTitle {...{canEdit}} />
   
         
          { <Button icon={<RiStackLine/>} onClick={(e)=>{
              e.preventDefault();
              const id = Date.now();
              updateNewId(id)
              dispatchEvent([{type:"ADDED_LAYER",user:user||null,id:id}])
          
              }}   modifiers={mods}>
                    Add layer
            </Button>}
   
  </div>
}

const FallBack = () => {
  const {pageTitle} = useContext(DataContext);
  return<div className={`${styles.header} flex-center`}>
    <div style={{marginRight:8}} >
      <div className={`${styles.editMapIconButton}`}>
        <RiEmojiStickerLine className={styles.mapIcon} size={24}/>
      </div>
    </div>
    <div  className={`${styles.title} ${styles.start} overflow-ellipsis flex-1`}>
        {pageTitle}
    </div>
  </div>
}

export default (props:TProps)=><ClientSideSuspense fallback={<FallBack/>}><Header {...props}/></ClientSideSuspense>; 

//onClick={addLayer}  