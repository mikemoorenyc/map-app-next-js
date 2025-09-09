
export default function ({string,query}:{string:string,query:string}) {
  const stringSplit = string.split(" ");
  let boldPos :number;
  stringSplit.forEach((s,i) => {
    if(s.toLowerCase().startsWith(query.toLowerCase())) {
      boldPos = i;
      return false; 
    }
  })
  return <>
    {stringSplit.map((s,i) => {
      if(i !== boldPos) {
        return <span key={i}>{`${s} `}</span>
      }
      const bolded = s.substring(0,query.length);
      const nonBolded = s.substring(query.length);
      return <span key={i}><strong>{bolded}</strong>{`${nonBolded} `}</span>
    })}
  </>
}