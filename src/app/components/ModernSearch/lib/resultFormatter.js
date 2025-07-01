import getCurrentPins from "./getCurrentPins";

const stringHighlight = (string, query) => {
  const stringSplit = string.split(" ");
  let boldPos 
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

export default function(query, layerData, predictionsRaw=[])  {
  
  
  const localPins = layerData.map(l=>l.pins).flat(); 
  const activePins = getCurrentPins(localPins,query).map(p => {
    return {...p, ...{titleBolded: stringHighlight(p.title,query)}}
  });
  const predictions =  predictionsRaw.map(p => {
    return {
      title: p.description, 
      id: p.place_id,
      new:true,
      titleBolded: stringHighlight(p.description,query)
    }
  }).filter(p => {
    return !activePins.map(a=>a.id).includes(p.id);
  }) 
  
  const pinsFlat = [...activePins,...predictions];
  return {
    pinsFlat,predictions,activePins
  }
  

}