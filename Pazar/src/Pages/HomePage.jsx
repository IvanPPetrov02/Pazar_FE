import Navbar from "../Components/Navbar.jsx";
import CategoryMenu from "../Components/CategoryMenu.jsx";
import FilterSidebar from "../Components/FilterSidebar.jsx";
import Suggestions from "../Components/Suggestions.jsx";
import Footer from "../Components/Footer.jsx";

function HomePage() {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <CategoryMenu />
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
}

export default HomePage;