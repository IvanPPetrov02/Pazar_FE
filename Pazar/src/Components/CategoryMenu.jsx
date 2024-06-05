import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import api from '../Services/axiosInstance';

const CategoryMenu = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/Category/GetCategories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <Dropdown className="d-flex justify-content-center my-2">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                Categories
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {categories.map((category) => (
                    <Dropdown.Item key={category.id} href={`/categories/${category.id}/items`}>
                        {category.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CategoryMenu;
