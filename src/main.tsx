import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { validateEnv } from './utils/env'
import { Analytics } from '@vercel/analytics/react'

console.log('Application initialization started');

try {
  // Validate environment variables before starting the app
  validateEnv();
  console.log('Environment validation successful');

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  console.log('Creating React root');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>,
  );
  console.log('React root created and rendered');
} catch (error) {
  console.error('Failed to initialize application:', error);
  // Display a user-friendly error message
  const errorElement = document.createElement('div');
  errorElement.style.padding = '20px';
  errorElement.style.color = 'red';
  errorElement.textContent = 'Failed to load the application. Please try refreshing the page.';
  document.body.appendChild(errorElement);
}
