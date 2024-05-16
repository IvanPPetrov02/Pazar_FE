import Cookies from 'js-cookie';
import { useContext } from 'react';
import AuthContext from '../../src/Services/AuthContext.jsx';

const LogoutButton = () => {
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            Cookies.remove('jwt'); // Remove the JWT cookie
            setIsLoggedIn(false); // Update the authentication state
            window.location.href = '/'; // Redirect to the homepage
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