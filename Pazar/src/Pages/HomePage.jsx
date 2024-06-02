import Navbar from '../Components/Navbar.jsx';
import FilterSidebar from '../Components/FilterSidebar.jsx';
import Suggestions from '../Components/Suggestions.jsx';
import Footer from '../Components/Footer.jsx';
import useAuth from '../Services/useAuth.jsx';

const HomePage = () => {
    useAuth();

    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-fluid flex-grow-1">
                <div className="row">
                    <div className="col-md-3">
                        <FilterSidebar />
                    </div>
                    <div className="col-md-9">
                        <Suggestions />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
