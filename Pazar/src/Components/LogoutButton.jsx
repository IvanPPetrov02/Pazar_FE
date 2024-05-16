import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const LogoutButton = ({ setIsAuthenticated }) => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/User/logout'); // Adjust according to your API endpoint
            Cookies.remove('jwt'); // Remove the JWT cookie
            setIsAuthenticated(false); // Update the authentication state
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

LogoutButton.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default LogoutButton;