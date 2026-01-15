import { TGeolocation, TLayer } from "@/projectTypes";
import getCurrentPins from "./getCurrentPins";
import { BasicResults } from "../SearchLogic";

export type TPredictionResult = {
  title:string, 
  id:string, 
  new?:boolean,
  titleBolded:string,
  location?:TGeolocation
}

const stringHighlight = (string:string, query:string) => {
  const stringSplit = string.split(" ");
  let boldPos :number
  stringSplit.forEach((s,i) => {
    if(s.toLowerCase().startsWith(query.toLowerCase())) {
      boldPos = i;
      return false; 
    }
  })
  return stringSplit.map((s,i) => {
    if(i !== boldPos) {
        return s
    }
    const bolded = s.substr(0,query.length);
    const nonBolded = s.substr(query.length);
    return `<strong>${bolded}</strong>${nonBolded}`
  }).join(" ")
}

export default function(query:string, layerData:TLayer[], predictionsRaw:BasicResults[]=[])  {
  
  
  const localPins = layerData.map(l=>l.pins).flat(); 
  const activePins = getCurrentPins(localPins,query).map(p => {
    return {...p, ...{titleBolded: stringHighlight(p.title,query)}} as TPredictionResult
  });
  const predictions :TPredictionResult[]=  predictionsRaw.map(p => {
    return {
      title: p.description, 
      id: p.place_id,
      new:true,
      titleBolded: stringHighlight(p.description,query)
    }
  }).filter(pin => {
    return !activePins.map(a=>a.id).includes(pin.id);
  }) 
  
  const pinsFlat = [...activePins,...predictions];
  return {
    pinsFlat,predictions,activePins
  }
  

}