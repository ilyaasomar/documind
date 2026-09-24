import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// get object/file
export async function getObject(storageKey: string) {
  const result = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: storageKey,
    }),
  );
  const bytes = await result.Body?.transformToByteArray();
  return Buffer.from(bytes!);
}
// upload object/file
export async function uploadObject(
  storageKey: string,
  body: Buffer,
  contentType: string,
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: storageKey,
      Body: body,
      ContentType: contentType,
    }),
  );
  return storageKey;
}

// delete object means delete file
export async function deleteObject(storageKey: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: storageKey,
    }),
  );
}
