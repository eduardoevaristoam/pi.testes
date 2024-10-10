import { S3Client } from "@aws-sdk/client-s3";
//Debuggar isso depois
import { config } from "dotenv";
config();

const client = new S3Client({
  forcePathStyle: true,
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export default client;
