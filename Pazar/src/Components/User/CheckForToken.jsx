import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../Services/useAuth.jsx';

const CheckForToken = () => {
    const history = useHistory();
    const { auth, logout } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            history.push('/login');
        }
    }, [history, auth, logout]);

    return null;
};

export default CheckForToken;
