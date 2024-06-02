import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <button onClick={handleLoginRedirect} className="btn btn-primary">
            Log In
        </button>
    );
};

export default LoginButton;