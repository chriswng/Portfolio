import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './fashion.css';
import FashionApp from './FashionApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FashionApp />
  </React.StrictMode>
);
