import React from 'react';
import Navbar from "../Components/Navbar.jsx";
import FilterSidebar from "../Components/FilterSidebar.jsx";
import Items from "../Components/Items.jsx"; // You need to create this component
import Footer from "../Components/Footer.jsx";

function ItemsPage() {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-fluid flex-grow-1 my-3">
                <div className="row">
                    <div className="col-md-3">
                        <FilterSidebar /> {/* This component should be created to handle item filtering */}
                    </div>
                    <div className="col-md-9">
                        <Items /> {/* Display items for sale here */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ItemsPage;
