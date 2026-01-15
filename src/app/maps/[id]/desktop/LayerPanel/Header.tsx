'use client'
import { useContext,memo, useEffect ,useState, RefObject} from "react"
import styles from "./Header.module.css"
import MapIcon from "./MapIcon"
import Button, { TModOptions } from "@/_components/Button"
import MapTitle from "./MapTitle"
import { ClientSideSuspense, useMyPresence } from "@liveblocks/react"
import { RiEmojiStickerLine } from "@remixicon/react"
import DataContext from "@/_contexts/DataContext"

import { RiStackLine } from "@remixicon/react"
import useLiveEditing from "@/_lib/useLiveEditing"
import addDisabledMod from "@/_lib/addDisabledMod"
import useLayerData from "@/_lib/useLayerData"
import useActiveStore from "@/_contexts/useActiveStore"
import { useLayers, usePageTitle } from "@/_lib/dataHooks"

type TProps = {
  layerRef: RefObject<HTMLDivElement|null>
}

const MapIconMemo = memo(MapIcon);


const Header = ({layerRef}:TProps) => {
  
  
  const [newId,updateNewId] = useState<null|number>(null);
  
  const canEdit = useActiveStore(set=>set.canEdit);
  const setActiveLayer = useActiveStore(set=>set.updateActiveLayer)
  
  const layerData = useLayers(); 
  useEffect(()=> {
    if(!layerRef||!layerRef?.current) return ;
    if(!layerData.length) return ; 
    if(layerData[layerData.length - 1].id == newId) {
      setTimeout(()=> {
        if(!layerRef||!layerRef?.current) return ;
        layerRef.current.scrollTop = layerRef.current.scrollHeight;
      },50)
      setActiveLayer(newId);
      updateNewId(null);
    }
  },[layerData,layerRef])

  
  

  return <div className={`${styles.header} flex-center`}>
  
  <MapIconMemo {...{canEdit}} />
    <MapTitle {...{canEdit}} />
    <AddLayerButton {...{updateNewId}}/>
   
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
const AddLayerButton = ({updateNewId}:{updateNewId:Function}) => {
  const [myPresence,updateMyPresence] = useMyPresence(); 
  const canEdit = useActiveStore(set=>set.canEdit);
  const dispatchEvent = useLiveEditing();
  if(!myPresence) return ; 
 
  const email = myPresence.email
  const name = myPresence.name
  const user = {email,name};
  let mods :TModOptions[] = addDisabledMod(["sm","ghost"],!canEdit);
  return <Button icon={<RiStackLine/>} onClick={(e)=>{
              e.preventDefault();
              const id = Date.now();
              if(!user) return ; 
              updateNewId(id)
              dispatchEvent([{type:"ADDED_LAYER",user:user||null,id:id}])
          
              }}   modifiers={mods}>
                    Add layer
            </Button>
}

export default (props:TProps)=><ClientSideSuspense fallback={<FallBack/>}><Header {...props}/></ClientSideSuspense>; 

//onClick={addLayer}  