
import { getMap } from "@/app/actions/maps";
import { headers } from "next/headers";
import { isMobile } from "@/app/lib/isMobile";
import "./desktop/gmWindowOverrides.css"
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/app/components/LoadingSkeleton";
export const dynamic = 'force-dynamic';
const Mobile = lazy(()=> import("./Mobile"))
const Composer = lazy(()=>import("./desktop/Composer"))
const Page = async function({params}) {
  const h = await headers(); 
  const userAgent = h.get("user-agent") || "";
  const mobileCheck = isMobile(userAgent);
  const {id} = await params; 
  const map = await getMap(parseInt(id));
  return <>
  {mobileCheck ? <Suspense fallback={<LoadingSkeleton/>}><Mobile mapData={map} /></Suspense>: <Suspense fallback={<LoadingSkeleton />}><Composer mapData={map} /></Suspense>}
  </>

  

}

export default Page; 