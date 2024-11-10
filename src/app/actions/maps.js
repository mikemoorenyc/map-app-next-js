"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamodb/ddbDocClient"
import { GetCommand,UpdateCommand } from "@aws-sdk/lib-dynamodb";

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
  const createddate = new Date().toLocaleString()
    const payload = {
      TableName: "MapApp",
      Item: {
        id: Date.now(),
        created_at : createddate,
        modified_at: createddate,
        title: mapName ,
      }
    }
    try {
      const data = await ddbDocClient.send(new PutCommand(payload));
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
const updateMap = async function(id,pageTitle,layerData) {
  const command = {
    TableName:"MapApp",
    Key : {
      id: id
    },
    UpdateExpression: `set title = :title, modified_at = :modified_at ${layerData ? ", layerData = :layerData" : ""}`,
    ExpressionAttributeValues: {
      ":title" : pageTitle,
      ":modified_at" : new Date().toLocaleString(),
      ":layerData" : layerData || null
    },
    ReturnValues: "ALL_NEW"
  }
  const update = await ddbDocClient.send(new UpdateCommand(command));
  const mapData = await getMap(id)
  return mapData; 

}
export{getMap,getAllMaps,addMap,updateMap}  