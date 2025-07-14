import FAButton from "@/app/components/FAButton/FAButton"
import {RiMap2Line} from "@remixicon/react"
import { addMap } from "@/app/actions/maps"
import { useRouter } from 'next/navigation'


export default function() {
  const router = useRouter();
  const addClicked = async (e) => {
    e.preventDefault(0);
    console.log("Fab clicked")
    const added = await addMap(`Untitled map`);
    if(!added) {
      alert("couldn't make map");
      return ; 
    }
    router.push(`/maps/${added.id}`)
  }
  return <FAButton onClick={addClicked} icon={<RiMap2Line/>}>New map</FAButton>
}
