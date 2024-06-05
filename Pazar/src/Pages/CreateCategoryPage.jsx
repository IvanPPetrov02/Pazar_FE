import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import CreateCategory from '../Components/CreateCategory';
import CategoryList from '../Components/CategoryList';

const CreateCategoryPage = () => {
    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <CategoryList />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Category</h1>
                        <CreateCategory />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CreateCategoryPage;
