import { getMap } from "@/app/actions/maps";


export async function generateMetadata({params}) {
  const {id} = await params; 
 let mapData = await getMap(parseInt(id));
  return {
    title: `${mapData.title} - Map App`
  }
}
export default function({children}) {
  return <>
  {children}
  </>
}