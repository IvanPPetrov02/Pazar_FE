import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('https://localhost:7267/api/User/Logout', {}, {
                withCredentials: true,
            });
            Cookies.remove('jwt'); // Remove the JWT cookie
            setIsLoggedIn(false); // Update the authentication state
            navigate("/");
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-secondary">
            Log Out
        </button>
    );
};

export default LogoutButton;
