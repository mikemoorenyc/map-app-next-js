import { archiveMap as archiveMapsServer,deleteMap as deleteMapServer,getAllMaps } from "../actions/maps";
export async function archiveMap(mapId, toArchive,updateFunction,mapData) {
  console.log(mapId);
  console.log(mapData);
  const originalData = [...mapData];
  
  const itemtoRemoveIndex = mapData.findIndex((m) => m.id == mapId);
  const itemtoRemove = mapData.find(m => m.id === mapId);
  if(!itemtoRemove) {
    alert('map not found');
    return ; 
  }

  let archivedMaps = mapData.filter(m => {
    //RemoveFromArchive
    if(!toArchive && m.id == mapId) {
      return false; 
    }
    if(m.isArchived) {
      return m ; 
    }
  });
  let activeMaps = mapData.filter(m => {
    //Remove from active
    if(toArchive && m.id == mapId) {
      return false; 
    }
    if(!m.isArchived) {
      return m; 
    }
  });
  
  //Add to archive
  if(toArchive) {
    archivedMaps = [...archivedMaps,...[{...itemtoRemove,...{isArchived:true}}]];
  }
  if(!toArchive) {
    activeMaps = [...activeMaps, ...[{...itemtoRemove, ...{isArchived:false}}]]
  }
  const newMapData = [...activeMaps,...archivedMaps];
  updateFunction(newMapData);
  const updateonServer = await archiveMapsServer(mapId,toArchive);
  if(!updateonServer) {
    alert("couldnt update");
    updateFunction(originalData);
    return ; 
  }
  const updated = await getAllMaps(); 
  if(!updated) {
    alert('couldnt get maps');
    return ; 
  }
  console.log('updated data');
  updateFunction(updated);

}

export async function deleteMap(mapId,mapData,updateFunction) {
  const newData = mapData.filter(m => m.id !== mapId);
  updateFunction(newData);
  const newMaps = await deleteMapServer(mapId);
  if(!newMaps) {
    alert("couldnt delete");
    return ;
  }
  console.log("new maps!");
  
  updateFunction(newMaps);
}

export async function moveMap(mapId, direction, mapData, updateFunction) {
  const sortedMaps = [...mapData];

  const currentIndex = sortedMaps.findIndex(m=>m.id==mapId)
  const itemToMove = sortedMaps.splice(currentIndex,1)[0];
  sortedMaps.splice(direction=="up"?currentIndex-1: currentIndex+1,0,itemToMove)
  updateFunction([...sortedMaps]);

  //updateFunction([...sortedMaps]);
  /*const arrSplicer = (arr) => {
    let spliced = [...arr];
    var itemToMove = spliced.splice(currentIndex,1)[0]
    spliced.splice(goingUp? currentIndex-1 : currentIndex+1 ,0,itemToMove)
      return spliced; 
    }
    const newLayers =  layers.map(l => {
          if(itemType == "pin" && l.id === arrayId) {
            const mutedPins = arrSplicer(layers.find(n => n.id === arrayId).pins)
     
            return {...l, ...{pins:mutedPins}};
          }
          return l 
        })
        if(itemType == "layer") {
          return arrSplicer(newLayers);
        }
        return newLayers; 
        */
}