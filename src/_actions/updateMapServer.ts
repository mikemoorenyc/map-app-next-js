"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../_lib/dynamodb/ddbDocClient";
import { GetCommand,UpdateCommand,DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { getMap } from "./maps";
import { THomepageMap,TLayer,TMap,TMapUpdateValues } from "@/projectTypes";

const table = process.env.TABLE_NAME

type TUpdateAttrs = Record<string,string|number|boolean|TLayer[]>

export const updateMapServer = async (mapId:number, payload:TMapUpdateValues={}) :Promise<TMap|false> =>  {
  console.log(mapId);
  console.log(payload);
  if(!table) return false; 
  const updateExpression = [];
  let attributes :TUpdateAttrs = {
    ":modified_at": new Date().toLocaleString()
  }
  for (const [key, value] of Object.entries(payload)) {
    updateExpression.push(`${key}=:${key}`);
    attributes[`:${key}`] = value
  }
  if(!updateExpression.length) return false;


  const command = {
    TableName: table,
    Key: {
      id: mapId
    },
    UpdateExpression: `set ${updateExpression.join(",")},modified_at=:modified_at`,
    ExpressionAttributeValues: attributes,
    ReturnValues: "ALL_NEW" as ReturnValue
  }
  try {
    if(!ddbDocClient) {
      throw new Error("ddb not connected");
    }
    const updatedItem = await ddbDocClient.send(new UpdateCommand(command));
    if(!updatedItem) return false; 
    return await getMap(mapId);
  } catch(err) {
    console.log(Error,"error"); 
    console.log(err);
    return false;
  }



}
