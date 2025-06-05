"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamodb/ddbDocClient"
import { GetCommand,UpdateCommand,DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { mapSort ,reindexMap} from "../lib/sortMaps";
/*
import { sql } from '@vercel/postgres';

export async function addMap(mapName) {
  
  try {
    await sql`INSERT INTO maps (name) VALUES (${mapName});`;
  } catch (error) {
    return {error: "Couldn't add"}
  }
  const maps = await sql`SELECT * FROM maps ORDER BY created_at DESC`;
  return {success: "true",maps:maps.rows}; 
}
export async function getMaps() {
  const maps = await sql`SELECT * FROM maps ORDER BY created_at DESC`
  return {maps: maps.rows};
}
export async function getMapData(id) {
  
}
*/

const addMap = async function(mapName) {
  const allMaps = await getAllMaps();
  if(!allMaps) return false; 
  const mapsSorted = mapSort(allMaps);

  const createddate = new Date().toLocaleString()
  const id = Date.now()
    const payload = {
      TableName: "MapApp",
      Item: {
        id: id,
        sortOrder: mapsSorted.active.length,
        created_at : createddate,
        modified_at: createddate,
        title: mapName ,
        layerData: [
          {
            title: "Untitled Layer",
          color: "#f0f0f0",
          id: Date.now(),
          lightOrDark: "light",
          pins: [],
          }
        ]
      }
    }
    try {
      const data = await ddbDocClient.send(new PutCommand(payload));
      const map = await getMap(id)
      return map; 
      const items = getAllMaps(); 
      return items; 
      return {message:"success"};
    } catch (err) {
      console.log("Error", err);
  }
}
const getAllMaps = async function() {
  try {
     const data = await ddbDocClient.send(new ScanCommand({ TableName: "MapApp" }));
     
      return data.Items;
      
    } catch (err) {
      console.log("Error", err);
    }
}
const getMap = async function(id) {

  const input = {
    TableName : "MapApp",
    Key: {
      id: id
    }
 
  }
  try {
     const data = await ddbDocClient.send(new GetCommand(input));  
   
     return data.Item
      
      
    } catch (err) {
      console.log("Error", err);
    }
}
const archiveMap = async (id,toArchive) => {
  console.log(toArchive);
  const allMaps = await getAllMaps(); 
  if(!allMaps) return false; 
  const mapsSorted = mapSort(allMaps);
  const orderSort = toArchive ? mapsSorted.archived.length - 1 : mapsSorted.active.length - 1
  const command = {
    TableName: "MapApp",
    Key: {
      id: id,
   
    },
    UpdateExpression:`set isArchived = :isArchived, order = :order`,
    ExpressionAttributeValues: {
      ":isArchived":toArchive,
      ":order": orderSort
    },
    ReturnValues: "ALL_NEW"
  }
  try {
    const setArchived = await ddbDocClient.send(new UpdateCommand(command));
    console.log(setArchived); 
    return await getMap(id); 
  } catch(err) {
    console.log("error",err); 
    return false; 
    
  }
}
const updateMap = async function(id,pageTitle,layerData,mapIcon) {
  const command = {
    TableName:"MapApp",
    Key : {
      id: id
    },
    UpdateExpression: `set title = :title, modified_at = :modified_at ${layerData ? ", layerData = :layerData" : ""} ${mapIcon? ", mapIcon=:mapIcon":""}`,
    ExpressionAttributeValues: {
      ":title" : pageTitle,
      ":modified_at" : new Date().toLocaleString(),
      ":layerData" : layerData || null,
      ":mapIcon" : mapIcon
    },
    ReturnValues: "ALL_NEW"
  }
  const update = await ddbDocClient.send(new UpdateCommand(command));
  const mapData = await getMap(id)  
  return mapData; 

}
const deleteMap = async function(id) {
  const command = {
    TableName:"MapApp",
    Key : {
      id: id
    }
  }
  const deleteItem = await ddbDocClient.send(new DeleteCommand(command));
  console.log(deleteItem);
  //return deleteItem; 
  
  return getAllMaps(); 

}
export{getMap,getAllMaps,addMap,updateMap, deleteMap,archiveMap}  
