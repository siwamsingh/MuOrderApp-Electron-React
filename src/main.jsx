import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {  HashRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Excel from "./components/Excel";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/excel" element={<Excel />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
