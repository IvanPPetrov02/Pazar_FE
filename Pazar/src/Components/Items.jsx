function Items() {
    // Example items data. You would likely fetch this data from an API in a real app.
    const items = [
        { id: 1, name: 'Item 1', description: 'Description for Item 1', price: '$10' },
        { id: 2, name: 'Item 2', description: 'Description for Item 2', price: '$20' },
        { id: 3, name: 'Item 3', description: 'Description for Item 3', price: '$30' },
        // ... more items
    ];

    return (
        <div>
            <h2>Items for Sale</h2>
            <div className="row">
                {items.map((item) => (
                    <div key={item.id} className="col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card">
                            <img src={`/path/to/item/images/${item.id}.jpg`} className="card-img-top" alt={item.name} />
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text">{item.description}</p>
                                <div className="card-footer">
                                    <small className="text-muted">{item.price}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Items;
