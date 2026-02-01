
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider, NavigationProvider, CartProvider } from './store';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </NavigationProvider>
    </AuthProvider>
  </React.StrictMode>
);
