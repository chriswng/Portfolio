import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './work.css';
import WorkApp from './WorkApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WorkApp />
  </React.StrictMode>
);
