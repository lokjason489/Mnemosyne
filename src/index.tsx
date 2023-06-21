import './index.css'; // import the CSS file
import App from './App';
import react from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import React from 'react';

const root = react.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();