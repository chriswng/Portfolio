// A draft: unlisted, and behind the passphrase gate shared with /lab/. See
// src/lib/gate.js for what that gate is and is not.
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './daily.css';
import Gate from '../components/Gate';
import DailyApp from './DailyApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Gate tool="daily" home="../">
      <DailyApp />
    </Gate>
  </React.StrictMode>
);
