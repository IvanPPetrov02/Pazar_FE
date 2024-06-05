import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <button onClick={handleLogin} className="btn btn-primary">
            Login
        </button>
    );
};

export default LoginButton;
