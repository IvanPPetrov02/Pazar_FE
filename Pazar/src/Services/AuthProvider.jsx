import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from './axiosInstance';
import TokenManager from './TokenManager';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        isAuthenticated: !!TokenManager.getAccessToken(),
        loading: false,
    });

    useEffect(() => {
        const checkAuth = async () => {
            if (auth.isAuthenticated) {
                try {
                    const response = await api.get('/api/User/checkJwtToken');
                    setAuth({ user: response.data.username, isAuthenticated: true, loading: false });
                } catch (error) {
                    setAuth({ user: null, isAuthenticated: false, loading: false });
                }
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        setAuth((prevState) => ({ ...prevState, loading: true }));
        try {
            const response = await api.post('/api/User/login', credentials);
            TokenManager.setAccessToken(response.data.token);
            setAuth({ user: response.data.email, isAuthenticated: true, loading: false });
            window.location.href = '/';
        } catch (error) {
            setAuth((prevState) => ({ ...prevState, loading: false }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/User/logout');
            TokenManager.clear();
            setAuth({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    console.log('AuthProvider', { auth });

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth, AuthContext };
