import FAButton from "@/app/components/FAButton/FAButton"
import { RiAddCircleFill } from "@remixicon/react"
import { addMap } from "@/app/actions/maps"
import { redirect } from "next/navigation"


export default function() {
  const addClicked = async (e) => {
    e.preventDefault(0);
    console.log("Fab clicked")
    const added = await addMap(`Untitled map`);
    if(!added) {
      alert("couldn't make map");
      return ; 
    }
    redirect(`/maps/${added.id}`)
  }
  return <FAButton onClick={addClicked} icon={<RiAddCircleFill/>}>New map</FAButton>
}