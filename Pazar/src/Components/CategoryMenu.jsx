function CategoryMenu() {
    return (
        <div className="nav justify-content-center bg-light p-2">
            <a className="nav-link" href="#">Books</a>
            <a className="nav-link" href="#">Clothes</a>
            <a className="nav-link" href="#">Electronics</a>
            {/* Add more categories as needed */}
        </div>
    );
}

export default CategoryMenu;