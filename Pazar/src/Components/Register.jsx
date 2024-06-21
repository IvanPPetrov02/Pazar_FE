import { useState } from 'react';
import api from '../Services/AxiosImport.jsx';

const Register = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!name || !surname || !email || !password) {
                setError('All fields are required.');
                setLoading(false);
                return;
            }

            const response = await api.post('/api/User/register', {
                email,
                password,
                name,
                surname
            });
            if (response.status === 200 && response.data.message === "User created") {
                alert('Registration successful! Please log in.');
                window.location.href = '/login';
            } else {
                setError('Registration failed. ' + response.data.message);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Registration failed. Please try again.');
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-5">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        data-testid="name-input"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Surname</label>
                    <input
                        type="text"
                        className="form-control"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        name="surname"
                        data-testid="surname-input"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        data-testid="email-input"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        data-testid="password-input"
                    />
                </div>
                {error && <div className="alert alert-danger" data-testid="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading} data-testid="submit-button">
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
