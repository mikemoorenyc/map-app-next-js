// Create service client module using ES6 syntax.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Set the AWS Region.
const REGION = "us-west-2"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const keyId = process.env.NEXT_AWS_ACCESS_KEY_ID
const key = process.env.NEXT_AWS_SECRET_ACCESS_KEY

const ddbClient = (!key || !keyId)? false : new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: key,
  },
});

export { ddbClient };