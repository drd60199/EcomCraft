// A simple contact form component
import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await axios.post('/api/contact', formData);
      setStatus(response.data.message);
      setFormData({ name: '', email: '', message: '' }); // Clear the form
    } catch (error) {
      setStatus('Failed to send message.');
      console.error('API Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Contact Us</h3>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" />
      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message"></textarea>
      <button type="submit">Send</button>
      <p>{status}</p>
    </form>
  );
};

export default ContactForm;