import { ClientSideSuspense } from "@liveblocks/react/suspense"
import styles from "./styles.module.css"
import { RiStackLine } from "@remixicon/react"
import DataContext from "@/_contexts/DataContext"
import Button from "@/_components/Button"
import { RefObject, useContext } from "react"
import MobileActiveContext from "@/_contexts/MobileActiveContext"

import useLiveEditing from "@/_lib/useLiveEditing"
import addDisabledMod from "@/_lib/addDisabledMod"

type Props = {
  legendScroll:RefObject<HTMLDivElement|null>
}

const AddLayerButton = ({legendScroll}:Props) => {
  const {activeData} = useContext(MobileActiveContext);
  const {user} = useContext(DataContext);
  const {canEdit} = activeData;
  const dispatchEvent = useLiveEditing(); 
  return <Button icon={<RiStackLine/>} modifiers={addDisabledMod(["sm"],!canEdit)} className={styles.layerAddButton} onClick={(e)=>{
      e.preventDefault();
      dispatchEvent([{type:"ADDED_LAYER",user:user||null}])
      if(legendScroll && legendScroll.current) {
        legendScroll.current.scrollTop = legendScroll.current.scrollHeight + 500
      }
      
      }} >Add a layer</Button>
}


export default (props:Props) => <ClientSideSuspense fallback={<></>}><AddLayerButton {...props} /></ClientSideSuspense>