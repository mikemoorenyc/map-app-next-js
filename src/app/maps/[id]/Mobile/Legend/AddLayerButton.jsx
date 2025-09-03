import { ClientSideSuspense } from "@liveblocks/react/suspense"
import styles from "./styles.module.css"
import { RiStackLine } from "@remixicon/react"
import DataContext from "@/app/contexts/DataContext"
import Button from "@/app/components/Button"
import { useContext } from "react"
import MobileActiveContext from "@/app/contexts/MobileActiveContext"
MobileActiveContext
import useLiveEditing from "@/app/lib/useLiveEditing"

const AddLayerButton = ({legendScroll}) => {
  const {activeData} = useContext(MobileActiveContext);
  const {user} = useContext(DataContext);
  const {canEdit} = activeData;
  const dispatchEvent = useLiveEditing(); 
  return <Button icon={<RiStackLine/>} modifiers={["sm",!canEdit?"disabled":""]} className={styles.layerAddButton} onClick={(e)=>{
      e.preventDefault();
      dispatchEvent({type:"ADDED_LAYER",user:user||null})
      legendScroll.current.scrollTop = legendScroll.current.scrollHeight + 500
      
      }} >Add a layer</Button>
}


export default (props) => <ClientSideSuspense><AddLayerButton {...props} /></ClientSideSuspense>