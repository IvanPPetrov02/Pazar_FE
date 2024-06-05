import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Services/AuthProvider';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    </React.StrictMode>
);