import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The ProductDisplay component fetches and displays a list of products from the backend.
const ProductDisplay = () => {
  // Use state to store the array of products fetched from the API.
  const [products, setProducts] = useState([]);
  // Use state to track the loading status, showing a loading message while data is being fetched.
  const [loading, setLoading] = useState(true);
  // Use state to store any error messages that occur during the API call.
  const [error, setError] = useState(null);

  // The useEffect hook runs once when the component is mounted.
  useEffect(() => {
    // This inner function handles the asynchronous data fetching.
    const fetchProducts = async () => {
      try {
        // Send a GET request to the backend API to retrieve the products.
        const response = await axios.get('/api/products');
        // If the request is successful, update the products state with the data.
        setProducts(response.data);
        // Clear any previous error messages.
        setError(null);
      } catch (err) {
        // Log the error to the console for debugging purposes.
        console.error('Failed to fetch products:', err);
        // Set a user-friendly error message in the state.
        setError('Failed to load products. Please try again later.');
        // Set products to an empty array to handle the rendering of the error state.
        setProducts([]);
      } finally {
        // This block runs regardless of success or failure.
        // Set loading to false to hide the loading message.
        setLoading(false);
      }
    };

    // Call the data fetching function.
    fetchProducts();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Conditionally render a loading message while the API call is in progress.
  if (loading) {
    return <div>Loading products...</div>;
  }

  // Conditionally render an error message if an error occurred.
  if (error) {
    return <div>{error}</div>;
  }
  
  // This is the line that will now have the data it needs to render
  return (
    <div>
      <h2>Our Products</h2>
      {/* Map over the products array and render each product's details. */}
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          {/* Format the price to a fixed number of decimal places. */}
          <p>Price: ${Number(product.price).toFixed(2)}</p>
        </div>
      ))}
      {/* Display a message if there are no products to show. */}
      {products.length === 0 && !loading && !error && (
        <p>No products available at the moment.</p>
      )}
    </div>
  );
};

export default ProductDisplay;