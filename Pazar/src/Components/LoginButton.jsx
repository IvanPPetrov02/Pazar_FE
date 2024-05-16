import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

const LoginButton = () => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLoginRedirect = () => {
        setIsLoggedIn(true);
        navigate('/auth');
    };

    return (
        <button onClick={handleLoginRedirect} className="btn btn-primary">
            Log In
        </button>
    );
};

export default LoginButton;