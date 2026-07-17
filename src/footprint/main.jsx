import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './footprint.css';
import FootprintApp from './FootprintApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FootprintApp />
  </React.StrictMode>
);
