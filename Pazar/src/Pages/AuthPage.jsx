import Login from "../Components/Login";
import Register from '../Components/Register';

const AuthPage = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <Login />
                </div>
                <div className="col-md-5">
                    <Register />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
