const sortMaps = async (mapData,updateFunction, mapId,goingUp) => {
  const {active,archived} = sortMaps(mapData);
  const currentIndex = active.findIndex(m=>m.id === mapId);
  if(!currentIndex) alert("couldn't find item"); return false; 
  const newActives = reindexMap(active.splice(goingUp? currentIndex-1 : currentIndex+1 ,0,itemToMove));
  const newMapData = [...newActives,...archived];
  updateFunction(newMapData);
  for(const map of newActives) {
    const oldData = mapData.find(m=>m.id === map.id);
    if(!oldData) continue; 
    if(oldData.sortOrder === map.sortOrder) continue; 

    const updatedItem = await updateMapServer(mapId,{
      UpdateExpression: "set sortOrder = :sortOrder",
      ExpressionAttributeValues: {
        ":sortOrder": map.sortOrder
      }
    })
    if(!updatedItem) alert("couldn't update Item on server"); 
    updateFunction(newMapData.map(m => {
      if(m.id === map.id) {
        return updatedItem;
      } else {
        return m;
      }
      
    })
  }
}
