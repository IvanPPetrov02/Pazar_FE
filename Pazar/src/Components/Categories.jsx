function Categories() {
    // Example categories data. You might fetch this data from an API instead.
    const categories = [
        { id: 1, name: 'Category 1', imageUrl: '/path/to/image1.jpg', action: 'View More' },
        { id: 2, name: 'Category 2', imageUrl: '/path/to/image2.jpg', action: 'View More' },
        { id: 3, name: 'Category 3', imageUrl: '/path/to/image3.jpg', action: 'View More' },
        { id: 4, name: 'Category 4', imageUrl: '/path/to/image4.jpg', action: 'View More' },
        { id: 5, name: 'Category 5', imageUrl: '/path/to/image5.jpg', action: 'View More' },
        // Add more categories as needed
    ];

    return (
        <div className="container mt-3">
            <div className="row">
                {categories.map(category => (
                    <div className="col-md-4 d-flex align-items-stretch" key={category.id}>
                        <div className="card mb-4 shadow-sm">
                            <img src={category.imageUrl} className="card-img-top" alt={category.name} />
                            <div className="card-body">
                                <h5 className="card-title">{category.name}</h5>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="btn-group">
                                        <button type="button" className="btn btn-sm btn-outline-secondary">{category.action}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categories;