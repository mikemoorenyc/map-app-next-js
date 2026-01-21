import { ClientSideSuspense, useMyPresence } from "@liveblocks/react/suspense"
import styles from "./styles.module.css"
import { RiStackLine } from "@remixicon/react"
import DataContext from "@/app/contexts/DataContext"
import Button from "@/app/components/Button"
import { RefObject, useContext } from "react"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"

import useLiveEditing from "@/app/lib/useLiveEditing"
import addDisabledMod from "@/app/lib/addDisabledMod"
import useActiveStore from "@/app/contexts/useActiveStore"

type Props = {
  legendScroll:RefObject<HTMLDivElement|null>
}

const AddLayerButton = ({legendScroll}:Props) => {
  const canEdit = useActiveStore(s=>s.canEdit);
  const dispatchEvent = useLiveEditing(); 
  const [prescence] = useMyPresence();

  if(!prescence.email&&!prescence.name) return ; 

  return <Button icon={<RiStackLine/>} modifiers={addDisabledMod(["sm"],!canEdit)} className={styles.layerAddButton} onClick={(e)=>{
      e.preventDefault();
      dispatchEvent([{type:"ADDED_LAYER",user:prescence||null}])
      if(legendScroll && legendScroll.current) {
        legendScroll.current.scrollTop = legendScroll.current.scrollHeight + 500
      }
      
      }} >Add a layer</Button>
}


export default (props:Props) => <ClientSideSuspense fallback={<></>}><AddLayerButton {...props} /></ClientSideSuspense>