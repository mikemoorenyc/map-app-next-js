import { getMap } from "@/app/actions/maps";
import {use} from "react"

export async function generateMetadata({params}) {
  const {id} = await params; 
 let mapData = await getMap(parseInt(id));
  return {
    title: `${mapData.name} - Map App`
  }
}
export default function({children}) {
  return <>
  {children}
  </>
}