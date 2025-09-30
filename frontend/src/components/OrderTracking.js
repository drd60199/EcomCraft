import React, { useState } from 'react';
import axios from 'axios';

// The OrderTracking component allows users to check the status of a specific order.
const OrderTracking = () => {
  // Use state to manage the order ID input from the user.
  const [orderId, setOrderId] = useState('');
  // Use state to store the fetched order data.
  const [order, setOrder] = useState(null);
  // Use state to provide user feedback on the status of the API call.
  const [status, setStatus] = useState('');

  // This function handles changes to the input field.
  const handleChange = (e) => {
    setOrderId(e.target.value);
    // Clear the previous order data and status when the input changes.
    setOrder(null); 
    setStatus('');
  };

  // This function is called when the form is submitted.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Fetching order...'); // Set a loading status.

    try {
      // Make a GET request to the backend API to fetch the order details by ID.
      const response = await axios.get(`/api/orders/${orderId}`);
      // If the request is successful, update the state with the fetched order data.
      setOrder(response.data);
      setStatus(''); // Clear the status message on success.
    } catch (error) {
      // Handle API errors based on the response status.
      if (error.response && error.response.status === 404) {
        setStatus('Order not found. Please check the ID.');
      } else {
        setStatus('Failed to fetch order details.');
      }
      console.error('API Error:', error);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Track Your Order</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="orderId" 
          value={orderId} 
          onChange={handleChange} 
          placeholder="Enter Order ID"
        />
        <button type="submit">Track</button>
      </form>
      <p>{status}</p>
      {/* Conditionally render the order details if the order state is not null. */}
      {order && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h4>Order Details</h4>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;