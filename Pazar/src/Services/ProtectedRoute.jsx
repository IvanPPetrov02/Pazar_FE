import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider.jsx';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        return null;
    }

    if (authContext.loading) {
        return <div>Loading...</div>;
    }

    return authContext.isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

ProtectedRoute.propTypes = {
    children: PropTypes.element.isRequired,
};

export default ProtectedRoute;
