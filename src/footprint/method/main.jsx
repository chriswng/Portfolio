import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/global.css';
import '../footprint.css';
import MethodApp from './MethodApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MethodApp />
  </React.StrictMode>
);
