import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import { auth } from './firebase/firebase-config'; // Import the auth object from its own file.

// Import all child components that will be rendered within the main application.
import ContactForm from './components/ContactForm';
import ProductDisplay from './components/ProductDisplay';
import CustomOrderForm from './components/CustomOrderForm';
import OrderTracking from './components/OrderTracking';
import InvoiceDisplay from './components/InvoiceDisplay';

// The App component is the root of the frontend application.
const App = () => {
  // Use state to track if the Firebase authentication service is ready.
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  // The useEffect hook manages the asynchronous Firebase initialization.
  useEffect(() => {
    // onAuthStateChanged is the definitive way to know when the Firebase SDK
    // has completed its asynchronous setup.
    const unsubscribe = onAuthStateChanged(auth, () => {
      // Set the state to true once Firebase is ready, which will trigger a re-render.
      setIsFirebaseReady(true);
      // Unsubscribe from the listener after the first call to prevent memory leaks.
      unsubscribe();
    });

    // The return function serves as a cleanup to ensure the listener is removed
    // if the component unmounts.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Conditionally render a loading screen while Firebase is initializing.
  if (!isFirebaseReady) {
    return <div>Loading Application...</div>;
  }

  // Once Firebase is ready, render the main application content and its child components.
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to EcomCraft!</h1>
      </header>
      <main>
        {/* Pass the fully initialized auth object as a prop to components that need it. */}
        <ContactForm />
        <CustomOrderForm auth={auth} />
        <ProductDisplay />
        <OrderTracking />
        <InvoiceDisplay auth={auth} />
      </main>
    </div>
  );
};

export default App;