import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './lab.css';
import LabApp from './LabApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LabApp />
  </React.StrictMode>
);
