import { useAuth } from '../Services/AuthProvider';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <Link to="/">Home</Link>
            {isAuthenticated ? (
                <>
                    <Link to="/profile">Profile</Link>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
