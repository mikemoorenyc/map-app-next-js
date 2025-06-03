import { archiveMap as archiveMapsServer,deleteMap as deleteMapServer,getAllMaps } from "../actions/maps";
import { reindexMap,mapSort } from "../lib/sortMaps";
import { updateMapServer } from "../actions/updateMapServer";

export async function updateMaps(oldMapData,newMapData, mapId=null, updatePackage={}){
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

export async function archiveMap(mapData,mapId, toArchive, updateFunction) {
  const toMove = {...mapData.find(m => m.id === mapId), isArchived: toArchive}; 

  const sorted = mapSort(mapData); 
  const newActive = reindexMap(toArchive ? sorted.active.filter(m=>m.id !== mapId) : [...sorted.active,...[toMove]]);
  const newArchive = reindexMap(toArchive ? [...sorted.archived,...[toMove]] : sorted.archived.filter(m=>m.id !== mapId)); 
  const updatedMapData = [...newActive,...newArchive]; 
  updateFunction(updatedMapData); 
 
  const updatedOnServer = await updateMaps(mapData,updatedMapData,mapId,{isArchived:toArchive}); 
  console.log(updatedOnServer);
  if(!updatedOnServer){
    alert("Couldn't updated on server"); 
    updateFunction(mapData); 
    return false; 
  } 
  updateFunction(updatedOnServer); 
}

export const deleteMap = async (mapData,mapId,updateFunction) => {
    const deleted = mapSort(mapData.filter(m=>m.id !== mapId)); 
    const reIndexed = [...reindexMap(deleted.active),...reindexMap(deleted.archived)];
    updateFunction(reIndexed); 
    const deletedMap = await deleteMapServer(mapId); 
    if(!deletedMap){
      alert("Couldn't delete on server"); 
      updateFunction(mapData); 
      return false; 
    }
    const updatedOnServer = await updateMaps(mapData,reIndexed);
    if(!updatedOnServer) {
      alert("Couldn't update"); 
      updateFunction(mapData); 
      return false
    } 
    updateFunction(updatedOnServer);
}




export const moveMap = async (mapData,mapId,updateFunction, goingUp) => {
  const {active,archived} = mapSort(mapData);
  const currentIndex = active.findIndex(m=>m.id === mapId);
  if(currentIndex === -1) {
    alert("couldn't find item");
    return false; 
  } 
  var itemToMove = active.splice(currentIndex,1)[0]
   active.splice(goingUp? currentIndex-1 : currentIndex+1 ,0,itemToMove)
  const newActives = reindexMap(active);
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