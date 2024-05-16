import { useState, useContext } from 'react';
import api from '../Services/AxiosImport.jsx'; // Ensure this is the correct path to your configured Axios instance
import Cookies from 'js-cookie';
import AuthContext from '../Services/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/User/login', { email, password });
            Cookies.set('jwt', response.data.token); // Set JWT token in cookies
            setIsLoggedIn(true); // Update the authentication state
            window.location.href = '/';
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                setError(error.response.data.message || 'Login failed. Please check your credentials and try again.');
            } else if (error.request) {
                console.error('Error request:', error.request);
                setError('No response from server. Please try again later.');
            } else {
                console.error('Error message:', error.message);
                setError('Login failed. Please check your credentials and try again.');
            }
            console.error('Error config:', error.config);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default Login;