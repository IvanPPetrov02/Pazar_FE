import Login from "../Components/Login";
import Register from '../Components/Register';

const AuthPage = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <h2>Login</h2>
                    <Login />
                </div>
                <div className="col-md-6">
                    <h2>Register</h2>
                    <Register />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;