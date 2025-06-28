const values = ["w","favorited","color","icon","hasIcon","picker","ld","size"] ;

export default (props,smallJoin,bigJoin) => {
    return values.map(v => {
      
      let value = props[v];
      if(!value) return false;

      if(typeof value == "boolean") {
        value = value.toString();
      }
      if(v == "color") {
        value = value.replace("#","");
      }

       
      return `${v}${smallJoin}${value}`
    }).filter(v=>v!== false).join(bigJoin);
  }