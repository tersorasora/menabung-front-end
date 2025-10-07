import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './App.css'

// Import Pages
import Login from './pages/login';
import Register from './pages/register';
import LandingPage from './pages/landing';

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <LandingPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
