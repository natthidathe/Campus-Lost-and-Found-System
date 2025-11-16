import dotenv from "dotenv";
dotenv.config();

import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

async function testConnection() {
  try {
    const res = await client.send(new ListTablesCommand({}));
    console.log("SUCCESS! DynamoDB tables:", res.TableNames);
  } catch (err) {
    console.error("FAILED:", err);
  }
}

testConnection();
