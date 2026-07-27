import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './targets.css';
import TargetsApp from './TargetsApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TargetsApp />
  </React.StrictMode>
);
