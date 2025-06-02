"use server";
import { PutCommand,ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../lib/dynamodb/ddbDocClient"
import { GetCommand,UpdateCommand,DeleteCommand } from "@aws-sdk/lib-dynamodb";



const updateMap = async (mapId, payload={}) => {
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
    TableName: "MapApp",
    Key: {
      id: mapId
    },
    UpdateExpression: `set ${updateExpression.join(",")}`,
    ExpressionAttributeValues: attributes,
    ReturnValues: "ALL_NEW"
  }
  try {
    const updatedItem = await ddbDocClient.send(new UpdateCommand(command));
    return updatedItem;
  } catch(err) {
    console.log(Error,"error"); 
    return false;
  }



}
