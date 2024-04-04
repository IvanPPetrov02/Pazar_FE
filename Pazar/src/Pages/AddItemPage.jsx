import Navbar from "../Components/Navbar.jsx";
import AddItem from "../Components/AddItem.jsx";
import Footer from "../Components/Footer.jsx";

function AddItemPage() {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 my-3">
                <AddItem />
            </div>
            <Footer />
        </div>
    );
}

export default AddItemPage;
