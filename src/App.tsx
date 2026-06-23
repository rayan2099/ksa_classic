import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Portal Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      
      {/* Global Notifications Handler */}
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  );
}
