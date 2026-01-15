import { getMap } from "@/_actions/maps";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactElement,ReactNode } from "react";



export async function generateMetadata({params}:{params:Promise<{id:string}>}) {
  const session = await auth();
  if(!session) {
    redirect("/login");
  }
  const {id} = await params; 
  if(!id) return false; 
 let mapData = await getMap(parseInt(id));
 if(!mapData) {
  return false; 
 }
  return {
    title: `${mapData.mapIcon||""}${mapData.title} - Map App`,
    appleWebApp: {
    title: mapData.title
  }
  }
}
export default async function({children}:{children:ReactNode}) {
  
  return <>
 
  {children}
  </>
}
