import React from 'react';
import { ToastProvider } from './components/ToastManager';
import AppRoutes from './components/AppRoutes';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
      <Chatbot />
    </ToastProvider>
  );
}

export default App;
