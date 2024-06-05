import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../Services/AuthProvider.jsx';
import TokenManager from '../../Services/TokenManager';

const CheckForToken = () => {
    const history = useHistory();
    const { auth, logout } = useContext(AuthContext);

    useEffect(() => {
        const token = TokenManager.getAccessToken();
        if (!token) {
            history.push('/login');
        }
    }, [history, auth, logout]);

    return null;
};

export default CheckForToken;
