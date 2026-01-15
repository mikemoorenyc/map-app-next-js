import { auth } from "@/auth";
import { Session } from "next-auth";
import { headers } from "next/headers";
import { isMobile } from "@/_lib/isMobile";
import "./desktop/gmWindowOverrides.css"
import { Suspense, lazy } from "react";
import LoadingSkeleton from "@/_components/LoadingSkeleton";
import { redirect } from 'next/navigation'
import { TUser } from "@/projectTypes";
import { getMap } from "@/_actions/maps";

const Mobile = lazy(()=> import("./Mobile"))
const Composer = lazy(()=>import("./desktop/Composer"))

export async function generateStaticParams() {
  return []
}
 
export const revalidate = 1500

const Page = async function({params}:{params:Promise<{id:string}>}) {

  


  const {id} = await params; 

  if(!id) {
    redirect("/404");
  }
  const map = await getMap(parseInt(id));
  if(!map) {
    redirect("/404")
  }


  return <Composer serverId={id} staticMode={false} map={map}/>

  

}

export default Page; 