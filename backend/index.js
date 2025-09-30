// Import the Express framework
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import the CORS middleware to handle cross-origin resource sharing
const cors = require('cors');

// Import the API router from a separate file
const apiRoutes = require('./routes/api');

// Configure CORS options to allow requests from your frontend's origin
const corsOptions = {
  origin: 'http://localhost'
};
app.use(cors(corsOptions));

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// A simple root route to confirm the backend server is running
app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

// Mount the API router for all routes that start with '/api'
app.use('/api', apiRoutes);

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});