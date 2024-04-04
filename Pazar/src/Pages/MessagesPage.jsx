import Navbar from "../Components/Navbar.jsx";
import Messages from "../Components/Messages.jsx";
import Footer from "../Components/Footer.jsx";

function MessagesPage() {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-fluid flex-grow-1 my-3">
                <Messages />
            </div>
            <Footer />
        </div>
    );
}

export default MessagesPage;
