// Import the Firebase Admin SDK
const admin = require('firebase-admin');

// Attempt to load and initialize the Admin SDK using a service account key
try {
  // Decode the Base64-encoded service account key from an environment variable
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8'));
  console.log('Service account key loaded successfully.');

  // Initialize the Firebase Admin SDK with the service account credentials
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  // If the key is missing or malformed, log the error
  console.error('Error loading service account key:', error);
}

// Get a reference to the Firestore database
const db = admin.firestore();

// Export the initialized database and admin objects for use in other files
module.exports = { db, admin };