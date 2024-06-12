import { useState, useEffect } from 'react';
import { Form, InputGroup, Button, Container } from 'react-bootstrap';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import api from '../Services/axiosInstance';

const ItemCreationPage = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [price, setPrice] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [condition, setCondition] = useState('0'); // LikeNew
    const [bidOnly, setBidOnly] = useState(false);
    const [bidDuration, setBidDuration] = useState('0'); // OneDay
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/Category/GetAllCategoriesWithSubcategories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setCategoryId(selectedCategoryId);
        const selectedCategory = categories.find(category => category.id === parseInt(selectedCategoryId));
        setSubCategories(selectedCategory ? selectedCategory.subcategories : []);
        setSubCategoryId(''); // Reset subcategory selection
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (value.length <= 300) {
            setDescription(value);
            setDescriptionLength(value.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const itemData = {
            Name: itemName,
            Description: description,
            Price: bidOnly ? null : price,
            Images: null, // Set images to null
            SubCategoryId: subCategoryId,
            Condition: parseInt(condition), // Convert to int
            BidOnly: bidOnly,
            BidDuration: bidOnly ? parseInt(bidDuration) : null, // Convert to int
            Status: 0, // Set a default value for status if required
            SellerId: '' // This will be set in the backend
        };

        try {
            await api.post('/api/Item', itemData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure you have token handling logic
                    'Content-Type': 'application/json',
                },
            });
            setSuccess('Item created successfully!');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setError('Failed to create item. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <Container className="mt-5">
                <h2>Create New Item</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label htmlFor="itemName">Name:</Form.Label>
                        <Form.Control
                            type="text"
                            id="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="description">Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            maxLength="300"
                            required
                        />
                        <small className="form-text text-muted">
                            {descriptionLength}/300 characters
                        </small>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="price">Price:</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>€</InputGroup.Text>
                            <Form.Control
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={bidOnly}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="categoryId">Category:</Form.Label>
                        <Form.Control
                            as="select"
                            id="categoryId"
                            value={categoryId}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {subCategories.length > 0 && (
                        <Form.Group>
                            <Form.Label htmlFor="subCategoryId">Subcategory:</Form.Label>
                            <Form.Control
                                as="select"
                                id="subCategoryId"
                                value={subCategoryId}
                                onChange={(e) => setSubCategoryId(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Select a subcategory
                                </option>
                                {subCategories.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}
                    <Form.Group>
                        <Form.Label htmlFor="condition">Condition:</Form.Label>
                        <Form.Control
                            as="select"
                            id="condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            required
                        >
                            <option value="0">Like New</option>
                            <option value="1">Used</option>
                            <option value="2">Refurbished</option>
                            <option value="3">New</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="form-check">
                        <Form.Check
                            type="checkbox"
                            id="bidOnly"
                            label="Bid Only"
                            checked={bidOnly}
                            onChange={(e) => setBidOnly(e.target.checked)}
                        />
                    </Form.Group>
                    {bidOnly && (
                        <Form.Group>
                            <Form.Label htmlFor="bidDuration">Bid Duration:</Form.Label>
                            <Form.Control
                                as="select"
                                id="bidDuration"
                                value={bidDuration}
                                onChange={(e) => setBidDuration(e.target.value)}
                                required
                            >
                                <option value="0">One day</option>
                                <option value="1">Three days</option>
                                <option value="2">Five days</option>
                                <option value="3">Seven days</option>
                                <option value="4">Fourteen days</option>
                                <option value="5">Twenty one days</option>
                                <option value="6">Thirty days</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                    <Button type="submit" className="mt-2">
                        Create Item
                    </Button>
                </Form>
                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">{success}</p>}
            </Container>
            <Footer />
        </>
    );
};

export default ItemCreationPage;
