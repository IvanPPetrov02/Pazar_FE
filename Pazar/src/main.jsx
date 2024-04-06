import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Auth0Provider
            domain="ivan-p-petrov.eu.auth0.com"
            clientId="7XAqYVPfmEts4tRSqzeRQCDUII296Z5f"
            redirectUri={window.location.origin}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>
);


