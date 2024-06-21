import { useState, useEffect } from 'react';
import { useAuth } from '../Services/AuthProvider';
import { Alert } from 'react-bootstrap';

const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(credentials);
            window.location.href = '/';
        } catch (error) {
            console.error('Login failed:', error.message || error);
            setError(error.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Error state updated:', error);
    }, [error]);

    return (
        <div className="mt-5" data-testid="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        data-testid="email"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        data-testid="password"
                    />
                </div>
                {error && <Alert variant="danger" data-testid="error-message">{error}</Alert>}
                <button type="submit" className="btn btn-primary" disabled={loading} data-testid="login-button">
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
