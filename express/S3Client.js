const { S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client({
  forcePathStyle: true,
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = client;
