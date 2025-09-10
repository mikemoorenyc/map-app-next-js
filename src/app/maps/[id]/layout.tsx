import { getMap } from "@/app/actions/maps";
import { auth } from "@/app/auth";
import { ReactElement,ReactNode } from "react";



export async function generateMetadata({params}:{params:Promise<{id:string}>}) {
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
