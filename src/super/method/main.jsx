import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../styles/global.css';
import '../super.css';
import Method from './Method';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Method />
  </React.StrictMode>
);
