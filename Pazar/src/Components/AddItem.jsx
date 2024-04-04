import { useState } from 'react';

function AddItemForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the form data to the server/API
        console.log(formData);
        alert('Item submitted!');
        setFormData({
            name: '',
            description: '',
            price: ''
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Item for Sale</h2>
            <div className="form-group">
                <label htmlFor="itemName">Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="itemName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="itemDescription">Description:</label>
                <textarea
                    className="form-control"
                    id="itemDescription"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="itemPrice">Price:</label>
                <input
                    type="text"
                    className="form-control"
                    id="itemPrice"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default AddItemForm;
