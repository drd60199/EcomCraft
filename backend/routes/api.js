const express = require('express');
const router = express.Router();
const { s3 } = require('../b2-config');
const multer = require('multer');
const { checkIfAuthenticated } = require('../middleware/authMiddleware');
const firebaseAdmin = require('../firebase/firebase-config');

// Configure Multer for handling file uploads.
// memoryStorage stores the file in memory as a Buffer.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB file size limit
  // A file filter is used to validate file types for security.
  fileFilter: (req, file, cb) => {
    // Define allowed file types and extensions using a regular expression.
    const allowed = /jpeg|jpg|png|gif|mp4/;
    const isMimeValid = allowed.test(file.mimetype);
    const isExtValid = allowed.test(file.originalname.toLowerCase());

    // If both the MIME type and file extension are valid, accept the file.
    if (isMimeValid && isExtValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'), false);
    }
  }
});

// An API route to handle contact form submissions.
// This endpoint does not require authentication.
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate that all required fields are present.
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new document in the 'contactMessages' collection.
    const contactRef = firebaseAdmin.db.collection('contactMessages').doc();
    await contactRef.set({
      name,
      email,
      message,
      timestamp: new Date()
    });
    res.status(200).json({ message: 'Message received successfully!', id: contactRef.id });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Error processing your request.' });
  }
});

// An API route to handle custom order submissions.
// This endpoint requires a valid Firebase ID token for authentication.
// It also handles a single file upload.
router.post('/custom-orders', checkIfAuthenticated, upload.single('file'), async (req, res) => {
  const { name, email, orderDetails } = req.body;
  const file = req.file;

  const orderData = {
    name,
    email,
    orderDetails,
    status: 'Pending',
    timestamp: new Date()
  };

  try {
    // If a file was uploaded, handle the upload to Backblaze B2.
    if (file) {
      const params = {
        Bucket: process.env.B2_BUCKET_NAME, // The bucket name is read from the environment variables.
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
      };
      
      const data = await s3.upload(params).promise();
      orderData.fileUrl = data.Location; // Store the file's URL in the order data.
    }
    
    // Save the order data to a new document in the 'orders' collection.
    const orderRef = firebaseAdmin.db.collection('orders').doc();
    await orderRef.set(orderData);
    
    res.status(200).json({ message: 'Custom order submitted successfully!', orderID: orderRef.id });
  } catch (error) {
    console.error('Error processing custom order:', error);
    res.status(500).json({ message: 'Error submitting custom order.' });
  }
});

// An API route to fetch all products from the Firestore database.
router.get('/products', async (req, res) => {
  console.log('Received request for products');
  try {
    // Get all documents from the 'products' collection.
    const productsRef = firebaseAdmin.db.collection('products');
    const snapshot = await productsRef.get();
    // Map the documents to an array of product objects.
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Products fetched:', products);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products.' });
  }
});

// An API route to fetch a single product by its ID.
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Get a reference to the specific product document by its ID.
    const productRef = firebaseAdmin.db.collection('products').doc(id);
    const doc = await productRef.get();
    
    // Check if the document exists before returning the data.
    if (!doc.exists) {
      res.status(404).json({ message: 'Product not found.' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product.' });
  }
});

// An API route to fetch a single order by its ID.
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Get a reference to the specific order document by its ID.
    const orderRef = firebaseAdmin.db.collection('orders').doc(id);
    const doc = await orderRef.get();

    // Check if the document exists.
    if (!doc.exists) {
      res.status(404).json({ message: 'Order not found.' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order.' });
  }
});

// An API route to fetch a single invoice by its ID.
// This endpoint is protected by the checkIfAuthenticated middleware.
router.get('/invoices/:id', checkIfAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    // Get a reference to the specific invoice document by its ID.
    const invoiceRef = firebaseAdmin.db.collection('invoices').doc(id);
    const doc = await invoiceRef.get();
    
    // Check if the document exists.
    if (!doc.exists) {
      res.status(404).json({ message: 'Invoice not found.' });
    } else {
      res.status(200).json({ id: doc.id, ...doc.data() });
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Error fetching invoice.' });
  }
});

// Export the router to be used by the main server file.
module.exports = router;