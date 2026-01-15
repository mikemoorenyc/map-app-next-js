import { getMap } from "@/_actions/maps";
import Mobile from "../Mobile";
import { redirect } from "next/navigation";



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



  return <Mobile map={map} serverId={id} />

  

}

export default Page; 