import { getMap } from "@/app/actions/maps";
import Composer from "./Composer";
const Page = async function({params}) {
  const {id} = await params; 
  const map = await getMap(parseInt(id));
  return <Composer mapData={map} />
}

export default Page; 