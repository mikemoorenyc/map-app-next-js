import { auth } from "@/app/auth";
import { Session } from "next-auth";
import { headers } from "next/headers";
import { isMobile } from "@/app/lib/isMobile";
import "./desktop/gmWindowOverrides.css"
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/app/components/LoadingSkeleton";
import { redirect } from 'next/navigation'
import { TUser } from "@/projectTypes";
export const dynamic = 'force-dynamic';
const Mobile = lazy(()=> import("./Mobile"))
const Composer = lazy(()=>import("./desktop/Composer"))
const Page = async function({params}:{params:Promise<{id:string}>}) {
  const session : Session|null = await auth();
  if(!session) {
    redirect("/login");
  }
  


  const h = await headers(); 
  const userAgent = h.get("user-agent") || "";
  const mobileCheck = isMobile(userAgent);
  const {id} = await params; 

  const user=session.user as TUser
  if(!user) redirect("/login");

  return <>
  {mobileCheck ? <Suspense fallback={<LoadingSkeleton/>}><Mobile user={user} serverId={id} /></Suspense>: <Suspense fallback={<LoadingSkeleton />}><Composer serverId={id} user={user} /></Suspense>}
  </>

  

}

export default Page; 