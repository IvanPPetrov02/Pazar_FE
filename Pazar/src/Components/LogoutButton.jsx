import axios from 'axios';

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/User/logout'); // Adjust according to your API endpoint
            localStorage.removeItem('token');
            window.location.href = '/';
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
