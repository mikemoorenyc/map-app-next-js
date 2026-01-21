import { auth } from "@/app/auth";
import { Session } from "next-auth";
import { headers } from "next/headers";
import { isMobile } from "@/app/lib/isMobile";
import { getAllMaps } from "@/app/actions/maps";
import { redirect } from 'next/navigation'
import { TUser } from "@/projectTypes";
import { getMap } from "@/app/actions/maps";
import { O } from "@liveblocks/react/dist/room-BZvk8RRP.cjs";
export const dynamic = 'force-dynamic';
import Mobile from "../Mobile";

export const revalidate = 3600


export async function generateStaticParams() {
  return [];
}


const Page = async function({params}:{params:Promise<{id:string}>}) {
  const {id} = await params; 

  const map = await getMap(parseInt(id));
  if(!map) {
    redirect("/404");
  }



  return <Mobile {...{map}}/>

  

}

export default Page; 