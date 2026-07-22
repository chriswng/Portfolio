import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './progress.css';
import ProgressApp from './ProgressApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProgressApp />
  </React.StrictMode>
);
