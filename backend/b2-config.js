// Load environment variables from the .env file
require('dotenv').config();

// Import the AWS SDK for JavaScript
const AWS = require('aws-sdk');

// Assign environment variables to constants for clear access
const B2_KEY_ID = process.env.B2_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;
const B2_ENDPOINT = process.env.B2_ENDPOINT;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

// Create a new S3 instance with the B2 credentials and endpoint.
// This instance is used for all B2 bucket operations.
const s3 = new AWS.S3({
    endpoint: B2_ENDPOINT,
    accessKeyId: B2_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY,
    signatureVersion: 'v4',
    region: 'us-east-1' // B2 requires a region, though the value can be generic.
});

// Export the configured S3 object so it can be used in other files (e.g., api.js)
module.exports = { s3 };