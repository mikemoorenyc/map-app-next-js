
export default function(pins,query) {
  if(query.length < 2) return [];
    
    return pins.filter(p => {
      const titleSplit = p.title.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase()))
      const descSplit = p.description?p.description.split(" ").filter(t => t.toLowerCase().startsWith(query.toLowerCase())) : 0;
      if(descSplit.length || titleSplit.length) return p
      return false; 

   })
}