import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Form, InputGroup, Alert } from 'react-bootstrap';
import Navbar from "../Components/Navbar.jsx";
import api from '../Services/axiosInstance';

const EditItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchItem();
        } else {
            setError('Invalid item ID.');
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await api.get(`/api/Item/${id}`);
            setItem(response.data);
            setLoading(false);
        } catch (error) {
            setError(`Failed to fetch item details. ${error.response ? error.response.data.message : ''}`);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem((prevItem) => ({
            ...prevItem,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updatedItem = {
                ...item,
                description: item.description,
                price: item.bidOnly ? item.price : item.price, // Allow updating both for fixed-price items
            };
            await api.put(`/api/Item/${id}`, updatedItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Item updated successfully!');
            navigate(`/item/${id}`);
        } catch (error) {
            setError('Failed to update item. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <Container className="mt-5">
                <h2>Edit Item</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label htmlFor="description">Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            id="description"
                            name="description"
                            value={item.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    {!item.bidOnly && (
                        <Form.Group>
                            <Form.Label htmlFor="price">Price:</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>€</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={item.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>
                    )}
                    <Button type="submit" className="mt-2">
                        Update Item
                    </Button>
                </Form>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            </Container>
        </div>
    );
};

export default EditItemPage;
