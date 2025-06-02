const sortMaps = async (mapData,updateFunction, mapId,goingUp) => {
  const {active,archived} = sortMaps(mapData);
  const currentIndex = active.findIndex(m=>m.id === mapId);
  if(currentIndex === -1) {
    alert("couldn't find item");
    return false; 
  } 
  const itemToMove = active[currentIndex]; 
  active.splice(currentIndex,1); 
  const newActives = reindexMap(active.splice(goingUp? currentIndex-1 : currentIndex+1 ,0,itemToMove));
  const newMapData = [...newActives,...archived];
  updateFunction(newMapData);
  const updatedOnServer = await updateMaps(mapData,newMapData,{}); 
  if(!updatedOnServer) {
    alert("couldn't update sort"); 
    updateFunction(mapData); 
    return false; 
  }
  updateFunction(updatedOnServer); 
}

const updateMaps = async (oldMapData,newMapData, mapId, updatePackage) =>{
  for (const map of newMapData) {
    const oldData = oldMapData.find(m => m.id === map.id);
    if(!oldData) continue; 
    if(oldData.sortOrder === map.sortOrder && oldData.id !== mapId) continue; 
    let payload = {
      sortOrder: map.sortOrder
    }
    if(map.id === mapId) {
      payload = {...payload,...updatePackage}
    }
    try {
      const updatedItem = await updateMapServer(map.id,payload);
      

    } catch(err) {
      console.log("ERROR",err)
      return false; 
    }


  }
  return await getAllMaps(); 


}
const archiveMap = async (mapData,mapId, toArchive, updateFunction) => {
  const toMove = {...mapData.find(m => m.id === mapId), ...{isArchived: toArchive}}; 
  const sorted = mapSort(mapData); 
  const newActive = reindexMap(toArchive ? sorted.active.filter(m=>m.id !== mapId) ? [...sorted.active,...toMove]);
  const newArchive = reindexMap(toArchive ? [...toMove,...sorted.archived] : sorted.archived.filter(m=>m.id !== mapId); 
  const updatedMapData = [...newActive,...newArchive]; 
  updateFunction(updatedMapData); 
  const updatedOnServer = await updateMaps(updatedMapData); 
  if(!updatedOnServer){
    alert("Couldn't updated on server"); 
    updateFunction(mapData); 
    return false; 
  } 
  updateFunction(updatedOnServer); 
  

  const deletedMap = async (mapData,mapId,updateFunction) => {
  const deleted = mapSort(sortMaps.filter(m=>m.id !== mapId)); 
  const reIndexed = [...reindexMap(deleted.active),...reindexMap(deleted.archived)];
  updateFunction(reIndexed); 
  const deletedMap = await deleteMap(mapId); 
  if(!deleteMap){
    alert("Couldn't delete on server"); 
     updateFunction(mapData); 
  }
  const updatedOnServer = await updateMaps(mapData,reIndexed);
  if(!updatedOnServer) {
    alert("Couldn't update"); 
    updateFunction(mapData); 
    return false
  } 
  updateFunction(updatedOnServer);
}
