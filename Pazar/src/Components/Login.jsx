import { useState } from 'react';
import api from './AxiosImport.jsx'; // Ensure this is the correct path to your configured Axios instance

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/api/User/login', { email, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                setError(error.response.data.message || 'Login failed. Please check your credentials and try again.');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                setError('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
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
