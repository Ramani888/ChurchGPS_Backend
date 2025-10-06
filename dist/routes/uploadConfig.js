"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageMetadataFromUrl = exports.deleteFromS3 = exports.uploadToS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = require("aws-sdk"); // Using aws-sdk v2 for s3.upload() and deleteObject()
const dotenv_1 = __importDefault(require("dotenv"));
const url_1 = require("url"); // To help extract the file key from the S3 URL
dotenv_1.default.config();
// Multer configuration for in-memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Initialize S3 client using environment variables
const s3 = new aws_sdk_1.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
});
// Function to upload a file to S3
const uploadToS3 = async (file, bucketName) => {
    const fileKey = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const uploadResult = await s3.upload(params).promise();
        // ✅ Construct a full S3 path (not public, just a reference)
        const filePath = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
        return filePath;
    }
    catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Error uploading to S3');
    }
};
exports.uploadToS3 = uploadToS3;
const deleteFromS3 = async (fileUrl, bucketName) => {
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
    }
    catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('Error deleting file from S3');
    }
};
exports.deleteFromS3 = deleteFromS3;
const parseS3Url = (url) => {
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
const getImageMetadataFromUrl = async (url) => {
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
    }
    catch (error) {
        console.error('Error fetching image metadata:', error);
        throw new Error('Could not retrieve image metadata');
    }
};
exports.getImageMetadataFromUrl = getImageMetadataFromUrl;
const extractKeyFromObjectUrl = (fileUrl, bucketName) => {
    try {
        const url = new url_1.URL(fileUrl);
        let key = url.pathname.replace(`/${bucketName}/`, '');
        // Ensure there's no leading slash in the key
        if (key.startsWith('/')) {
            key = key.substring(1);
        }
        // Decode any URL-encoded characters in the key
        key = decodeURIComponent(key);
        console.log('Extracted key:', key); // Debugging log to verify key
        return key;
    }
    catch (error) {
        console.error('Error extracting key from Object URL:', error);
        throw new Error('Invalid S3 URL');
    }
};
exports.default = upload;
