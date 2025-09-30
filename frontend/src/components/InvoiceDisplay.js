import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth'; // Import the onAuthStateChanged listener

// This component now accepts the auth object as a prop from its parent, App.js.
const InvoiceDisplay = ({ auth }) => {
  // Use state to manage the user's input for the invoice ID.
  const [invoiceId, setInvoiceId] = useState('');
  // Use state to store the fetched invoice data.
  const [invoice, setInvoice] = useState(null);
  // Use state to provide user feedback on the status of the API call.
  const [status, setStatus] = useState('');
  // Use state to store the authenticated user's object.
  const [user, setUser] = useState(null);

  // This useEffect hook runs once when the component mounts to set up an authentication listener.
  useEffect(() => {
    // onAuthStateChanged is the definitive way to know if a user is logged in.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Set the user state with the current user object.
      setUser(currentUser);
    });
    
    // The cleanup function unsubscribes from the listener when the component unmounts.
    return () => unsubscribe();
  }, [auth]); // The dependency array ensures this effect only runs if the auth object changes.

  // This function handles changes in the input field.
  const handleChange = (e) => {
    setInvoiceId(e.target.value);
    // Clear previous invoice data and status when the input changes.
    setInvoice(null);
    setStatus('');
  };

  // This function is called when the form is submitted.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Fetching invoice...'); // Set a loading status.

    // Before making the API call, check if the user object exists.
    if (!user) {
      setStatus('Failed to fetch invoice details. You may need to log in.');
      // Stop the function from proceeding if the user is not authenticated.
      return;
    }

    try {
      // Get the user's ID token, which is required to authenticate the request on the backend.
      const token = await user.getIdToken();
      
      // Make a GET request to the backend API, including the authorization token in the headers.
      const response = await axios.get(`/api/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // If the request is successful, update the state with the fetched invoice data.
      setInvoice(response.data);
      setStatus('');
    } catch (error) {
      // Handle different types of errors based on the API response.
      if (error.response && error.response.status === 404) {
        setStatus('Invoice not found. Please check the ID.');
      } else if (error.response && error.response.status === 401) {
        // This handles cases where the token is invalid or expired.
        setStatus('Authentication failed. Please log in again.');
      } else {
        // A generic error message for other failures.
        setStatus('Failed to fetch invoice details.');
      }
      console.error('API Error:', error);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>View Your Invoice</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="invoiceId" 
          value={invoiceId} 
          onChange={handleChange} 
          placeholder="Enter Invoice ID"
        />
        <button type="submit">View Invoice</button>
      </form>
      <p>{status}</p>
      {/* Conditionally render the invoice details if the invoice state is not null. */}
      {invoice && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h4>Invoice Details</h4>
          <p><strong>Invoice ID:</strong> {invoice.id}</p>
          <p><strong>Order ID:</strong> {invoice.orderId}</p>
          <p><strong>Total:</strong> ${invoice.total}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceDisplay;