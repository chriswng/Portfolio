import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './grid.css';
import GridApp from './GridApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GridApp />
  </React.StrictMode>
);
