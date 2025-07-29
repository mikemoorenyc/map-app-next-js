import { auth } from "@/app/auth";
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
  const session = await auth();

  const h = await headers(); 
  const userAgent = h.get("user-agent") || "";
  const mobileCheck = isMobile(userAgent);
  const {id} = await params; 

  const user = (process.env.NODE_ENV === "development") ? {
    email: "fake@fake.com",
    name: "Fake User",
    image: "https://placehold.co/600x600"
  }: session.user

  return <>
  {mobileCheck ? <Suspense fallback={<LoadingSkeleton/>}><Mobile user={user} serverId={id} /></Suspense>: <Suspense fallback={<LoadingSkeleton />}><Composer serverId={id} user={user} /></Suspense>}
  </>

  

}

export default Page; 