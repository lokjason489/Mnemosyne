import './index.css'; // import the CSS file
import { CssBaseline } from '@mui/material';
import React from 'react';
import react from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './plugin/i18n/i18n.js';

const root = react.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);

reportWebVitals();
