
import { getMap } from "@/app/actions/maps";
import Composer from "./desktop/Composer";
import { headers } from "next/headers";
import { isMobile } from "@/app/lib/isMobile";
import "./desktop/gmWindowOverrides.css"
import Mobile from "./Mobile";
export const dynamic = 'force-dynamic';
const Page = async function({params}) {
  const h = await headers(); 
  const userAgent = h.get("user-agent") || "";
  const mobileCheck = isMobile(userAgent);
  const {id} = await params; 
  const map = await getMap(parseInt(id));
  if(mobileCheck) {
    return <Mobile mapData={map} />
  } else {
    return <Composer mapData={map} />
  }
  

}

export default Page; 