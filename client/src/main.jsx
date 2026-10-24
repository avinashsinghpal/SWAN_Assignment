/**
 * React entry point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import './styles/globals.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
