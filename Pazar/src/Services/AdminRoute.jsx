import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider.jsx';
import PropTypes from 'prop-types';

const AdminRoute = ({ children }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        return null;
    }

    if (authContext.loading) {
        return <div>Loading...</div>;
    }

    console.log('AdminRoute:', { isAuthenticated: authContext.isAuthenticated, user: authContext.user });

    if (!authContext.isAuthenticated) {
        console.log('User is not authenticated');
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (authContext.user?.role !== 1 || !authContext.user?.isActive) {
        console.log('User is not an admin or not active');
        return <Navigate to="/login" state={{ from: location }} />;
    }

    console.log('User is authenticated, active, and an admin');
    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
