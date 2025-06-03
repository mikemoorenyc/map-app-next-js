const mapSort = (mapList) => {
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