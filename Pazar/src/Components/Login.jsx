import React, { useState } from 'react';
import { useAuth } from '../Services/AuthProvider';

const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
