const mapSort = (mapList) => {
  const activeSort = mapList.filter(m => !m.isArchived).sort((a,b)=>{a.order - b.order});
  const archiveSort = mapList.filter(m => m.isArchived).sort((a,b)=>{a.order-b.order});
  return {
    active: activeSort,
    archived: archiveSort,
    all: [...activeSort,...archiveSort]
  }
}
const reindexMap = (mapList) => {
  return mapList.map((e,i)=> {
    return {...e, ...{order:i}}
  })
}

export{mapSort,reindexMap}