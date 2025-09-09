import { archiveMap as archiveMapsServer,deleteMap as deleteMapServer,getAllMaps } from "../actions/maps";
import { reindexMap,mapSort } from "../lib/sortMaps";
import { updateMapServer } from "../actions/updateMapServer";
import { THomepageMap,TMapUpdateValues } from "@/projectTypes";

type THomepageLists = {
  active: THomepageMap[],
  archived: THomepageMap[],
  all: THomepageMap[]
}


export async function updateMaps(oldMapData: THomepageMap[],newMapData:THomepageMap[], mapId:null|number=null , updatePackage:TMapUpdateValues={}): Promise<THomepageMap[]|false>{
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

export async function archiveMap(mapData:THomepageMap[],mapId:number, toArchive:boolean, updateFunction: (mapData:THomepageMap[])=>void) :Promise<false|void>{
  console.log(mapData);
  const findMove = mapData.find(m => m.id === mapId)
  if(!findMove) return false; 
  //create new copy of map with updated archive value
  const toMove = {...findMove,...{isArchived:toArchive}}
  //Remove from current list
  const toSort= mapData.filter(m=>m.id!==mapId);
  //sort out the list
  const sorted :THomepageLists = mapSort(toSort,"archive"); 
  //add to active active if unarchived
  const newActive = reindexMap(toArchive ? sorted.active : [...sorted.active,...[toMove]]);
  //add to archived if to archive
  const newArchive = reindexMap(!toArchive ? sorted.archived : [...sorted.archived,...[toMove]]); 

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

export const deleteMap = async (mapData:THomepageMap[],mapId:number,updateFunction:(mapData:THomepageMap[])=>void) => {
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




export const moveMap = async (mapData:THomepageMap[],mapId:number,updateFunction:(m:THomepageMap[])=>void, goingUp:boolean) => {
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
  const updatedOnServer = await updateMaps(mapData,newMapData); 
  if(!updatedOnServer) {
    alert("couldn't update sort"); 
    updateFunction(mapData); 
    return false; 
  }
  updateFunction(updatedOnServer); 
}