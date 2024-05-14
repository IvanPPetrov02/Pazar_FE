import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import AuthPage from "./Pages/AuthPage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/auth/*" element={<AuthPage />} />
                <Route path="/*" element={<HomePage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
