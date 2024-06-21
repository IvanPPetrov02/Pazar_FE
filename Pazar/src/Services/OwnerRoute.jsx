import { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider.jsx';
import api from './axiosInstance.jsx';
import PropTypes from 'prop-types';

const OwnerRoute = ({ children }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const { id } = useParams(); // Assuming the item's ID is part of the route params
    const [isOwner, setIsOwner] = useState(false);
    const [loadingOwner, setLoadingOwner] = useState(true);

    useEffect(() => {
        const checkIfOwner = async () => {
            if (authContext.isAuthenticated) {
                try {
                    const response = await api.get(`/api/Item/${id}/isseller`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setIsOwner(response.data.isSeller);
                } catch (error) {
                    console.error('Error checking if user is seller:', error);
                }
            }
            setLoadingOwner(false);
        };

        checkIfOwner();
    }, [id, authContext.isAuthenticated]);

    if (authContext.loading || loadingOwner) {
        return <div>Loading...</div>;
    }

    if (!authContext.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (!isOwner) {
        return <Navigate to="/" state={{ from: location }}/>;
    }

    return children;
};

OwnerRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default OwnerRoute;
