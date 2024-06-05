import { createContext, useContext/*, useState, useEffect*/ } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState(localStorage.getItem('user'));
    // const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    // const [loading, setLoading] = useState(false);
    // const navigate = useNavigate();

    // const checkJwtToken = async (token) => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get('/api/User/CheckJwtToken', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //
    //         if (response.data.hasToken) {
    //             setUser(response.data.username);
    //             setIsAuthenticated(true);
    //             navigate('/Home');
    //         } else {
    //             setUser(null);
    //             setIsAuthenticated(false);
    //             navigate('/login');
    //         }
    //     } catch (error) {
    //         console.error('Error checking JWT token:', error);
    //         setUser(null);
    //         setIsAuthenticated(false);
    //         navigate('/login');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const login = async (credentials) => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.post('/api/User/login', credentials);
    //         localStorage.setItem('token', response.data.token);
    //         localStorage.setItem('user', response.data.username);
    //         setUser(response.data.username);
    //         setIsAuthenticated(true);
    //         navigate('/quest');
    //     } catch (error) {
    //         console.error('Error logging in:', error);
    //         throw error;
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const logout = async () => {
    //     try {
    //         await axios.post('/api/User/logout');
    //         localStorage.removeItem('token');
    //         localStorage.removeItem('user');
    //         setUser(null);
    //         setIsAuthenticated(false);
    //         navigate('/');
    //     } catch (error) {
    //         console.error('Error logging out:', error);
    //     }
    // };

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         checkJwtToken(token);
    //     }
    // }, []);

    return (
        <AuthContext.Provider value={{ /*user, isAuthenticated, loading, login, logout*/ }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AuthContext };
