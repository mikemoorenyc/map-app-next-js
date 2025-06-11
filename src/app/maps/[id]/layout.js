import { getMap } from "@/app/actions/maps";
import { auth } from "@/app/auth";



export async function generateMetadata({params}) {
  const {id} = await params; 
 let mapData = await getMap(parseInt(id));
  return {
    title: `${mapData.mapIcon||""}${mapData.title} - Map App`,
    appleWebApp: {
    title: mapData.title
  }
  }
}
export default async function({children}) {
  
  return <>
 
  {children}
  </>
}
