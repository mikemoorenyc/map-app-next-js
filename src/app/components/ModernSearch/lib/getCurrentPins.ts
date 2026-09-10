import { TPin } from "@/projectTypes";
import { BasicResults } from "../SearchLogic";

export default function(pins:TPin[],query:string,predictionsRaw:BasicResults[]) {
  if(query.length < 2) return [];

  return pins.filter(p => {
      //If pin is within prediction results
    if (predictionsRaw.map(pr => pr.place_id).includes(p.id)) {
        return p
    }
    const pl = p.title.toLocaleLowerCase()
    const dl = p.description?.toLocaleLowerCase()||""
    const ql = query.toLocaleLowerCase()
    const titleMatch = ql.length < 4 ? pl.startsWith(ql) : pl.includes(ql)
    const descriptionMatch = ql.length < 4 ?dl.startsWith(ql):pl.includes(ql)
      //const titleSplit = p.title.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase()))
     // const descSplit = p.description?p.description.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase())) : "";
      //if(descSplit.length || titleSplit.length) return p
    if (titleMatch || descriptionMatch) {
        return p
    }

    return false;

  })
}
