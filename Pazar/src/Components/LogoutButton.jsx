import { useAuth } from '../Services/AuthProvider';

const LogoutButton = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
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
