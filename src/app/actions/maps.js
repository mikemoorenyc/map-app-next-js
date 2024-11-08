"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamodb/ddbDocClient"
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
        id: Math.floor(Math.random() * 10000),
        created_at : createddate,
        modified_at: createddate,
        name: mapName 
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
export{getAllMaps,addMap}  