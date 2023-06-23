import './index.css'; // import the CSS file
import App from './App';
import react from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import React from 'react';
import { CssBaseline } from '@mui/material';
import "./plugin/i18n/i18n.js";

const root = react.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
);


reportWebVitals();