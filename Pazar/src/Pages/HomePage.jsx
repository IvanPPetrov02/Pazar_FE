import Navbar from '../Components/Navbar.jsx';
import FilterSidebar from '../Components/FilterSidebar.jsx';
import Suggestions from '../Components/Suggestions.jsx';
import ItemsList from '../Components/ItemsList.jsx';
import Footer from '../Components/Footer.jsx';
import { useAuth } from '../Services/AuthProvider.jsx';  // Ensure you have the correct path
import ChatList from "../Components/ChatList.jsx";

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-fluid flex-grow-1">
                <div className="row">
                    <div className="col-md-3">
                        <FilterSidebar />
                    </div>
                    <div className="col-md-6">
                        <Suggestions />
                        <ItemsList />
                    </div>
                    <div className="col-md-3">
                        <h3>Chats:</h3>
                        {isAuthenticated ? (
                            <ChatList/>
                        ) : (
                            <p className="text-center mt-4">Chat is available for logged-in users only.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
