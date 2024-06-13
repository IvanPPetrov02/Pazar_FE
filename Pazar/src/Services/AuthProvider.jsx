import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import api from './axiosInstance';
import TokenManager from './TokenManager';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: TokenManager.getUserInfo(),
        isAuthenticated: !!TokenManager.getAccessToken(),
        loading: false,
    });

    const fetchUserInfo = async (token) => {
        try {
            const response = await api.get('/api/User/GetUser', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('GetUser response:', response.data);
            const userInfo = {
                role: response.data.role,
                isActive: response.data.isActive,
            };
            TokenManager.setUserInfo(userInfo);
            setAuth({ user: userInfo, isAuthenticated: true, loading: false });
        } catch (error) {
            console.error('Fetching user info failed:', error);
            setAuth({ user: null, isAuthenticated: false, loading: false });
        }
    };

    const login = async (credentials) => {
        setAuth((prevState) => ({ ...prevState, loading: true }));
        try {
            const response = await api.post('/api/User/login', credentials);
            TokenManager.setAccessToken(response.data.token);
            console.log('Login successful, JWT obtained:', response.data.token);
            await fetchUserInfo(response.data.token);
            window.location.href = '/';
        } catch (error) {
            console.error('Login failed:', error.message);
            setAuth((prevState) => ({ ...prevState, loading: false }));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/User/logout');
            TokenManager.clear();
            setAuth({ user: null, isAuthenticated: false, loading: false });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
