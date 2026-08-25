// A draft: unlisted, and behind the passphrase gate shared with /lab/. See
// src/lib/gate.js for what that gate is and is not.
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import './fashion.css';
import Gate from '../components/Gate';
import FashionApp from './FashionApp';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Gate tool="fashion" home="../">
      <FashionApp />
    </Gate>
  </React.StrictMode>
);
