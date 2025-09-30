// backend/middleware/authMiddleware.js
const admin = require('firebase-admin');

// This middleware checks if a user is authenticated by verifying their Firebase ID token.
const checkIfAuthenticated = async (req, res, next) => {
    // Get the Authorization header from the request.
    const authHeader = req.headers.authorization;

    // Check if the header exists and is in the correct 'Bearer <token>' format.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    // Extract the ID token from the Authorization header.
    const idToken = authHeader.split('Bearer ')[1];

    try {
        // Use the Firebase Admin SDK to verify the ID token.
        // This is an asynchronous operation that checks the token's validity and signature.
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // If the token is valid, attach the decoded token to the request object.
        // This makes the user's information available to subsequent middleware and route handlers.
        req.user = decodedToken;

        // Call the next middleware function in the stack.
        next();
    } catch (error) {
        // If the token is invalid or expired, log the error and send an unauthorized response.
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

module.exports = { checkIfAuthenticated };