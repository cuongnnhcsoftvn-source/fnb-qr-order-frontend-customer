import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Menu from './Menu';
import TableQR from './TableQR';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TableQR />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
