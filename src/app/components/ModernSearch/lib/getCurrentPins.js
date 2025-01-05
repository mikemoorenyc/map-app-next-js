
export default function(layerData,query) {
  if(query.length < 2) return [];
    const pins = layerData.map(l=>l.pins).flat(); 
    return pins.filter(p => {
      const titleSplit = p.title.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase()))
      const descSplit = p.description?p.description.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase())) : 0;
      if(descSplit.length || titleSplit.length) return p
      return false; 

   })
}