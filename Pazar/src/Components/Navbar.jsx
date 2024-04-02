import SearchBar from './SearchBar';
import Login from './Login';

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">SecondHandShop</a>
                <div className="mx-auto" style={{ width: "50%" }}> {/* Adjust the width as needed */}
                    <SearchBar />
                </div>
                <div className="ms-auto">
                    <Login />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;