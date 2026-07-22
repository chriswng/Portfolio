import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './daily.css';
import DailyApp from './DailyApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DailyApp />
  </React.StrictMode>
);
