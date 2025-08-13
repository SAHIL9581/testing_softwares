import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './index.css'
import Login from './Login.jsx'
import Page404 from './Page404.jsx'

import App from './APITest.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/api" element={<App />} />

        <Route path="*" element={<Page404 />} />

    </Routes>

    
    </BrowserRouter>
  </StrictMode>,
)
