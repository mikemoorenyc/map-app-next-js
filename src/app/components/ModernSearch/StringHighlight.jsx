
export default function ({string,query}) {
  const stringSplit = string.split(" ");
  let boldPos 
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
      const bolded = s.substr(0,query.length);
      const nonBolded = s.substr(query.length);
      return <span key={i}><strong>{bolded}</strong>{`${nonBolded} `}</span>
    })}
  </>
}