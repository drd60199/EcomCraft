import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root instance for concurrent mode and connect it to the root HTML element.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Use React.StrictMode to highlight potential problems in an application.
  <React.StrictMode>
    {/* Render the main application component, App. */}
    <App />
  </React.StrictMode>
);

// This function is used to measure and log application performance.
// You can remove it if you are not using performance analytics.
reportWebVitals();
