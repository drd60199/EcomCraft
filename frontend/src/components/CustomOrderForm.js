import React, { useState } from 'react';
import axios from 'axios';

// This component accepts the auth object as a prop from its parent, App.js.
// This ensures that the Firebase authentication service is ready to use.
const CustomOrderForm = ({ auth }) => {
  // Use state to manage the form data, including name, email, order details, and the selected file.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderDetails: '',
    file: null,
  });
  // Use state to manage the submission status, providing user feedback.
  const [status, setStatus] = useState('');

  // This function handles changes to form inputs, including file selection.
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      // If a file is selected, set the file property. Otherwise, set the value.
      [name]: files ? files[0] : value,
    }));
  };

  // This function is called when the form is submitted.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting order...'); // Provide user feedback that the form is being submitted.

    // Use the auth object from props to get the current user.
    // This is guaranteed to be a ready-to-use object because of the logic in App.js.
    const user = auth.currentUser;

    // Check if a user is authenticated. If not, stop the process and inform the user.
    if (!user) {
      setStatus('User is not authenticated. Please sign in first.');
      return;
    }

    try {
      // Get the user's ID token, which is required for authenticating with the backend.
      const token = await user.getIdToken();
      // Create a new FormData object to handle the file upload.
      const customOrderData = new FormData();
      customOrderData.append('name', formData.name);
      customOrderData.append('email', formData.email);
      customOrderData.append('orderDetails', formData.orderDetails);
      // Append the file to the form data if one was selected.
      if (formData.file) {
        customOrderData.append('file', formData.file);
      }

      // Send a POST request to the backend with the form data.
      const response = await axios.post('/api/custom-orders', customOrderData, {
        headers: {
          // Setting the Content-Type to multipart/form-data is crucial for file uploads.
          'Content-Type': 'multipart/form-data',
          // Include the ID token in the Authorization header to authenticate the request.
          'Authorization': `Bearer ${token}`,
        },
      });

      // Update the status with a success message from the backend.
      setStatus(response.data.message);
      // Clear the form fields after a successful submission.
      setFormData({ name: '', email: '', orderDetails: '', file: null });
    } catch (error) {
      // Handle any errors that occur during the API call and provide user feedback.
      setStatus('Failed to submit order.');
      console.error('API Error:', error);
    }
  };

  // The component's JSX structure for the form and its elements.
  return (
    <form onSubmit={handleSubmit}>
      <h3>Custom Order Form</h3>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" />
      <textarea name="orderDetails" value={formData.orderDetails} onChange={handleChange} placeholder="Order Details"></textarea>
      <input type="file" name="file" onChange={handleChange} />
      <button type="submit">Submit Order</button>
      <p>{status}</p>
    </form>
  );
};

export default CustomOrderForm;