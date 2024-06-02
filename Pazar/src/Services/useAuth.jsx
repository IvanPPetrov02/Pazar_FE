import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";  // Import the custom api instance

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkJwtToken = async () => {
            try {
                const response = await axios.get('/api/User/CheckJwtToken');  // Use the custom api instance

                if (response.data.hasToken) {
                    // Token is present, redirect to Home
                    navigate('/Home');
                } else {
                    // Token is not present, redirect to Login
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking JWT token:', error);
                navigate('/login'); // Redirect to login on error
            }
        };

        checkJwtToken();
    }, [navigate]);
};

export default useAuth;
