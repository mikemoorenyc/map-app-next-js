"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../_lib/dynamodb/ddbDocClient";
import { GetCommand,UpdateCommand,DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { mapSort ,reindexMap} from "../_lib/sortMaps";
import { auth} from "@/auth"
import { Session ,User} from "next-auth";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { TMap,THomepageMap,TMapUpdateValues,TLayer,TUser } from "@/projectTypes";
import safeUser from "../_lib/safeUser";
import { revalidatePath } from "next/cache";


const table = process.env.TABLE_NAME

const addMap = async function(mapName:string):Promise<TMap|false> {
  if(!ddbDocClient) {
    throw new Error('ddb client broekn');
  }
  if(!table) return false; 

const session: Session|null = await auth();
if(!session || !session?.user) {
  return false; 
}
  
  
  const allMaps = await getAllMaps();
  if(!allMaps) return false; 
  const mapsSorted = mapSort(allMaps);

  const user = session.user as TUser

  if(!safeUser(session.user)) return false; 
  
 

  const createddate = new Date().toLocaleString()
  const id = Date.now();

    const payload :{TableName:string,Item:TMap} = {
      TableName: table,
      Item: {
        id: id,
        sortOrder: mapsSorted.active.length,
        created_at : createddate,
        modified_at: createddate,
        createdBy:user,
        isArchived: false,
        title: mapName ,
        layerData: [
          {
            title: "Untitled Layer",
          color: "#f0f0f0",
          id: Date.now(),
          created: user,
          lightOrDark: "light",
          pins: [],
          }
        ]
      }
    }
    try {
      const data = await ddbDocClient.send(new PutCommand(payload));
      revalidatePath('/')
      const map = await getMap(id)
      return map; 
   
    } catch (err) {
      console.log("Error", err);
      return false; 
  }
}
const homepageMap = (item: TMap):THomepageMap => {
  const newItem  = {...item}; 
  const pinCount = newItem.layerData.map(l => l.pins).flat().length; 
  const markerString = newItem.layerData.reverse().map(l => {
      const color = l.color.replace("#","0x");
      
      return l.pins.map(p => {
        return `markers=size:tiny|color:${color}|${p.location.lat},${p.location.lng}`
      }).join("&");
    
  }).join("&");

  const { layerData, ...saveItem } = newItem; 
  return {...saveItem,...{pinCount,markerString}}
}
const getAllMaps = async function() : Promise<THomepageMap[]|false >{
  try {
    if(!ddbDocClient) {
      throw new Error('ddb client broekn');
    }
     const data = await ddbDocClient.send(new ScanCommand({ TableName: table }));
     if(!data || !data?.Items) return false; 

     const maps : TMap[] = data.Items as TMap[]
     
      return maps.map(homepageMap);
      
    } catch (err) {
      console.log("Error", err);
      return false 
    }
}
const getMap = async function(id:number): Promise<TMap|false> {

  const input = {
    TableName : table,
    Key: {
      id: id
    }
 
  }
  try {
    if(!ddbDocClient) {
      throw new Error('ddb client broekn');
    }
     const data = await ddbDocClient.send(new GetCommand(input));  
     const map  = data.Item; 

     if(!data.Item) return false; 
   
     return data.Item as TMap; 
      
      
    } catch (err) {
      console.log("Error", err);
      return false; 
    }
}
const archiveMap = async (id:number,toArchive:boolean): Promise<TMap|false> => {
  console.log(toArchive);
  const allMaps = await getAllMaps(); 
  if(!allMaps) return false; 
  const mapsSorted = mapSort(allMaps);
  const orderSort = toArchive ? mapsSorted.archived.length - 1 : mapsSorted.active.length - 1
  if(!table) return false; 
  const command = {
    TableName: table,
    Key: {
      id: id,
   
    },
    UpdateExpression:`set isArchived = :isArchived, order = :order`,
    ExpressionAttributeValues: {
      ":isArchived":toArchive,
      ":order": orderSort
    },
    ReturnValues: "ALL_NEW" as ReturnValue
  }
  try {
    if(!ddbDocClient) {
      throw new Error('ddb client broekn');
    }
    const setArchived = await ddbDocClient.send(new UpdateCommand(command));
    console.log(setArchived); 
    revalidatePath('/')
    return await getMap(id); 
  } catch(err) {
    console.log("error",err); 
    return false; 
    
  }
}
const updateMap = async function(id:number,pageTitle:string,layerData:TLayer[]|null=null,mapIcon?:string) : Promise<TMap|false>{
  if(!table) return false; 
  if(!ddbDocClient) {
    throw new Error('ddb client broekn');
  }
  const attrs = {
      ":title" : pageTitle,
      ":modified_at" : new Date().toLocaleString(),
      ":layerData" : layerData || null,
      ":mapIcon" : mapIcon||undefined
    }
  if(!mapIcon) {
    delete attrs[":mapIcon"];
  }
  const command = {
    TableName:table,
    Key : {
      id: id
    },
    UpdateExpression: `set title = :title, modified_at = :modified_at ${layerData ? ", layerData = :layerData" : ""} ${mapIcon? ", mapIcon=:mapIcon":""}`,
    ExpressionAttributeValues: attrs,
    ReturnValues: "ALL_NEW" as ReturnValue
  }
  const update = await ddbDocClient.send(new UpdateCommand(command));
  revalidatePath('/')
  const mapData = await getMap(id)  
  return mapData; 

}
const deleteMap = async function(id:number):Promise<THomepageMap[]|false >{
  if(!ddbDocClient) {
    throw new Error('ddb client broekn');
  }
  const command = {
    TableName:table,
    Key : {
      id: id
    }
  }
  const deleteItem = await ddbDocClient.send(new DeleteCommand(command));
  console.log(deleteItem);
  //return deleteItem; 
  revalidatePath('/')
  
  return getAllMaps(); 

}
export{getMap,getAllMaps,addMap,updateMap, deleteMap,archiveMap}  
