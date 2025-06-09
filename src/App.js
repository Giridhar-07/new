import React from 'react';
import { ToastProvider } from './components/ToastManager';
import AppRoutes from './components/AppRoutes';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
