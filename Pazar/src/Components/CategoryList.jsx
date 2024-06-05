import { useState, useEffect } from 'react';
import api from '../Services/axiosInstance';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/Category/GetAllCategoriesWithSubcategories');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prevExpanded) => ({
            ...prevExpanded,
            [categoryId]: !prevExpanded[categoryId],
        }));
    };

    return (
        <div>
            <h4>Categories List</h4>
            <ul className="list-group">
                {categories.map((category) => (
                    <li key={category.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center" onClick={() => toggleCategory(category.id)} style={{ cursor: 'pointer' }}>
                            {category.name}
                            <span>
                                {expandedCategories[category.id] ? (
                                    <i className="bi bi-chevron-up"></i>
                                ) : (
                                    <i className="bi bi-chevron-down"></i>
                                )}
                            </span>
                        </div>
                        {expandedCategories[category.id] && category.subcategories.length > 0 && (
                            <ul className="list-group mt-2">
                                {category.subcategories.map((sub) => (
                                    <li key={sub.id} className="list-group-item">
                                        {sub.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
