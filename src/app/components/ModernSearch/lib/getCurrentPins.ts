import { TPin } from "@/projectTypes";
import { BasicResults } from "../SearchLogic";

export default function(pins:TPin[],query:string,predictionsRaw:BasicResults[]) {
  if(query.length < 2) return [];

  return pins.filter(p => {
      //If pin is within prediction results
    if (predictionsRaw.map(pr => pr.place_id).includes(p.id)) {
        return p
    }
      //const titleSplit = p.title.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase()))
     // const descSplit = p.description?p.description.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase())) : "";
      //if(descSplit.length || titleSplit.length) return p
    if (p.title.toLowerCase().includes(query.toLowerCase())) {
        return p
    }
    if (p.description && p.description.toLowerCase().includes(query.toLowerCase())) {
      return p
    }
      return false;

   })
}
