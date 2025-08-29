import FAButton from "@/app/components/FAButton/FAButton"
import {RiMap2Line} from "@remixicon/react"
import { addMap } from "@/app/actions/maps"
import { useRouter } from 'next/navigation'
import { useState } from "react"


export default function() {
  const [isDisabled,updateIsDisabled] = useState(false);
  const router = useRouter();
  const addClicked = async (e) => {
    updateIsDisabled(true)
    e.preventDefault(0);
 
    console.log("Fab clicked")
    const added = await addMap(`Untitled map`);
    if(!added) {

      alert("couldn't make map");
      updateIsDisabled(true);
      return ; 
    }
    router.push(`/maps/${added.id}`)
  }
  return <FAButton onClick={addClicked} modifiers={isDisabled?["disabled"]:[]} icon={<RiMap2Line/>}>New map</FAButton>
}
