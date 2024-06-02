import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Services/useAuth.jsx';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const {checkJwtToken} = useContext(AuthContext);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/User/login', credentials);
            checkJwtToken(response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" onChange={handleChange} value={credentials.username} />
            <input name="password" onChange={handleChange} value={credentials.password} type="password" />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;