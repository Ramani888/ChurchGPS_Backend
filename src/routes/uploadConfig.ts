import multer from 'multer';
import { S3 } from 'aws-sdk'; // Using aws-sdk v2 for s3.upload() and deleteObject()
import dotenv from 'dotenv';
import { URL } from 'url'; // To help extract the file key from the S3 URL
import fs from 'fs';
import os from 'os';
import path from 'path';

dotenv.config();

// Use disk storage so very large files are written to disk and streamed to S3.
// This prevents holding large files in memory which can cause OOMs.
const tmpDir = os.tmpdir();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

// No `limits` option is set here so multer won't reject files based on size.
// Note: your hosting platform (proxy/nginx/load-balancer) may still enforce limits.
const upload = multer({ storage });

// Initialize S3 client using environment variables
const s3 = new S3({
  region: process.env.AWS_REGION, 
  accessKeyId: process.env.AWS_ACCESSKEYID, 
  secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});

// Function to upload a file to S3
export const uploadToS3 = async (
  file: Express.Multer.File,
  bucketName: string
): Promise<string> => {
  // If multer used memoryStorage, `file.buffer` will exist.
  // With diskStorage, the file will be on disk at `file.path` (filename in tmpDir).
  const fileKey = `${Date.now()}-${file.originalname}`;

  // Prepare Body: either a Buffer (memory) or a read stream (disk).
  let body: Buffer | fs.ReadStream;
  let tempFilePath: string | undefined;

  if ((file as any).buffer) {
    body = (file as any).buffer as Buffer;
  } else {
    // multer with diskStorage should add a `path` or `filename` relative to dest
    // prefer `path` (node-multer sets `path` on disk storage files)
    tempFilePath = (file as any).path || path.join(tmpDir, (file as any).filename || file.originalname);
    if (!tempFilePath) throw new Error('Temp file path not available for upload');
    body = fs.createReadStream(tempFilePath);
  }

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: body,
    ContentType: file.mimetype,
    ACL: 'public-read', // Make the file publicly readable
  };

  try {
    const uploadResult = await s3.upload(params).promise();

    const filePath = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;

    return filePath;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Error uploading to S3');
  } finally {
    // Clean up temp file if we created a read stream from disk
    try {
      if (tempFilePath) {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.warn('Failed to remove temp file:', tempFilePath, err);
        });
      }
    } catch (e) {
      // ignore cleanup errors
    }
  }
};

export const deleteFromS3 = async (fileUrl: string, bucketName: string): Promise<void> => {
  try {
    const bucket = bucketName;

    // Extract key from URL and decode it
    const key = extractKeyFromObjectUrl(fileUrl, bucket);

    const params = {
      Bucket: bucket,
      Key: key,
    };

    // Attempt to delete the file from S3
    await s3.deleteObject(params).promise();

    console.log(`File deleted successfully: ${fileUrl}`);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Error deleting file from S3');
  }
};

const parseS3Url = (url: string): { bucketName: string; key: string } | null => {
  const match = url.match(/^https:\/\/([^.]+)\.s3\.amazonaws\.com\/(.+)$/);

  if (match) {
      return {
          bucketName: match[1],
          key: decodeURIComponent(match[2]) // Decode URI components for special characters
      };
  }

  console.error('Invalid S3 URL format.');
  return null;
};

export const getImageMetadataFromUrl = async (url: string) => {
  const parsed = parseS3Url(url);
  if (!parsed) {
      throw new Error('Invalid S3 URL');
  }

  const { bucketName, key } = parsed;

  try {
      const headData = await s3.headObject({
          Bucket: bucketName,
          Key: key,
      }).promise();

      return {
          imageType: headData.ContentType,
          imageSize: headData.ContentLength,
          lastModified: headData.LastModified,
          etag: headData.ETag
      };
  } catch (error) {
      console.error('Error fetching image metadata:', error);
      throw new Error('Could not retrieve image metadata');
  }
};

const extractKeyFromObjectUrl = (fileUrl: string, bucketName: string): string => {
  try {
    const url = new URL(fileUrl);
    let key = url.pathname.replace(`/${bucketName}/`, '');

    // Ensure there's no leading slash in the key
    if (key.startsWith('/')) {
      key = key.substring(1);
    }

    // Decode any URL-encoded characters in the key
    key = decodeURIComponent(key);

    console.log('Extracted key:', key); // Debugging log to verify key
    return key;
  } catch (error) {
    console.error('Error extracting key from Object URL:', error);
    throw new Error('Invalid S3 URL');
  }
};

export default upload;
