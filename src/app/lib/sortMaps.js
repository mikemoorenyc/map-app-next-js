const mapSort = (mapList) => {
  /*
  const mapDataSmaller = (m) => {
    if(m.pinLength) {
      return m; 
    }
    const pinLength = m.layerData.map(m => m.pins).flat().length; 
    const newData = {...m};
    delete newData.layerData;

const markerString = m.layerData.reverse().map(l => {
      const color = l.color.replace("#","0x");
      
      return l.pins.map(p => {
        return `markers=size:tiny|color:${color}|${p.location.lat},${p.location.lng}`
      }).join("&");
    
}).join("&");

    return {...newData,...{pinLength,markerString}}

    
  }
  */
  const activeSort = mapList.filter(m => !m.isArchived).sort((a,b)=> a.sortOrder - b.sortOrder);
  const archiveSort = mapList.filter(m => m.isArchived).sort((a,b)=> a.sortOrder - b.sortOrder);
  return {
    active: activeSort,
    archived: archiveSort,
    all: [...activeSort,...archiveSort]
  }
}
const reindexMap = (mapList) => {
  return mapList.map((e,i)=> {
    return {...e, ...{sortOrder:i}}
  })
}

export{mapSort,reindexMap}