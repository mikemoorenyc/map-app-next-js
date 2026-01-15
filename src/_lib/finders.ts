import { TLayer, TPin } from "@/projectTypes";

const findPin = (layers:TLayer[],id:number|string):TPin => {
  const pin = layers.map(l=> {
    if (l?.pins) {
      return l.pins
    } else {
      return [];
    }
  }).flat().find(p => p.id == id)
  if(!pin) {
    throw new Error("no pin "+id);
  }
  return pin
}
const findLayer = (layers:TLayer[], id:number):TLayer => {
  const layer = layers.find(l => l.id == id)
  if(!layer) throw new Error ("no Layer "+id)
  return layer; 
}
/*
const isHighlighted = (activeData, pinId) => {
  return activeData.editingPin == pinId || activeData.hoveringPin == pinId
}
*/


export {findPin,findLayer};