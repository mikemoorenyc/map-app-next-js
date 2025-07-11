"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamodb/ddbDocClient"
import { GetCommand,UpdateCommand,DeleteCommand } from "@aws-sdk/lib-dynamodb";

const table = process.env.TABLE_NAME

export const updateMapServer = async (mapId, payload={}) => {
  console.log(mapId);
  console.log(payload);
  const updateExpression = [];
  let attributes = {
    ":modified_at": new Date().toLocaleString()
  }
  for (const [key, value] of Object.entries(payload)) {
    updateExpression.push(`${key}=:${key}`);
    attributes[`:${key}`] = value
  }
  if(!updateExpression.length) return;


  const command = {
    TableName: table,
    Key: {
      id: mapId
    },
    UpdateExpression: `set ${updateExpression.join(",")},modified_at=:modified_at`,
    ExpressionAttributeValues: attributes,
    ReturnValues: "ALL_NEW"
  }
  try {
    const updatedItem = await ddbDocClient.send(new UpdateCommand(command));
    return updatedItem;
  } catch(err) {
    console.log(Error,"error"); 
    console.log(err);
    return false;
  }



}
