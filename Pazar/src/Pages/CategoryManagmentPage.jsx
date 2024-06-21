import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import api from '../Services/axiosInstance';
import arrowIcon from '../../public/arrowIcon.png';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [editingItem, setEditingItem] = useState({ id: null, type: null });
    const [categoryName, setCategoryName] = useState('');
    const [isSubCategory, setIsSubCategory] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/Category/GetAllCategoriesWithSubcategories');
            setCategories(response.data);
            setExpandedCategories(response.data.reduce((acc, category) => {
                acc[category.id] = true;
                return acc;
            }, {}));
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prevExpanded) => ({
            ...prevExpanded,
            [categoryId]: !prevExpanded[categoryId],
        }));
    };

    const deleteItem = async (id, type) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            try {
                await api.delete(`/api/Category/${id}`);
                if (type === 'Category') {
                    setCategories(categories.filter(category => category.id !== id));
                } else {
                    const updatedCategories = categories.map(category => ({
                        ...category,
                        subcategories: category.subcategories.filter(sub => sub.id !== id)
                    }));
                    setCategories(updatedCategories);
                }
                alert('Category successfully deleted.');
            } catch (error) {
                console.error(`Failed to delete ${type.toLowerCase()}:`, error);
            }
        }
    };

    const editItem = (id, name, type, parentCategoryId = '') => {
        setEditingItem({ id, type });
        setCategoryName(name);
        if (type === 'Subcategory') {
            setIsSubCategory(true);
            setSelectedParentCategory(parentCategoryId);
        } else {
            setIsSubCategory(false);
            setSelectedParentCategory('');
        }
    };

    const handleCategoryNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        setIsSubCategory(e.target.checked);
        if (!e.target.checked) {
            setSelectedParentCategory('');
        }
    };

    const handleParentCategoryChange = (e) => {
        setSelectedParentCategory(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const categoryData = {
            name: categoryName,
            parentCategoryId: isSubCategory ? selectedParentCategory : null
        };

        try {
            if (editingItem.id) {
                await api.put(`/api/Category/${editingItem.id}`, categoryData);
                setSuccess('Category updated successfully!');
            } else {
                await api.post('/api/Category', categoryData);
                setSuccess('Category created successfully!');
            }
            fetchCategories();
            resetForm();
        } catch (error) {
            setError('Failed to save category. Please try again.');
        }
    };

    const resetForm = () => {
        setEditingItem({ id: null, type: null });
        setCategoryName('');
        setIsSubCategory(false);
        setSelectedParentCategory('');
        setError('');
        setSuccess('');
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5" data-testid="category-management-page">
                <div className="row">
                    <div className="col-md-3 mb-4 mb-md-0" data-testid="category-list">
                        <h4>Categories List</h4>
                        <ul className="list-group">
                            {categories.map((category) => (
                                <li key={category.id} className="list-group-item" data-testid={`category-${category.id}`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span onClick={() => toggleCategory(category.id)} style={{ cursor: 'pointer', flexGrow: 1 }}>
                                            <img
                                                src={arrowIcon}
                                                alt="Expand"
                                                className="me-2"
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    transform: expandedCategories[category.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s'
                                                }}
                                                data-testid={`expand-category-${category.id}`}
                                            />
                                            {category.name}
                                        </span>
                                        <div>
                                            <button className="btn btn-sm btn-warning me-2" onClick={() => editItem(category.id, category.name, 'Category')} data-testid={`edit-category-${category.id}`}>Edit</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteItem(category.id, 'Category')} data-testid={`delete-category-${category.id}`}>Delete</button>
                                        </div>
                                    </div>
                                    {expandedCategories[category.id] && category.subcategories.length > 0 && (
                                        <ul className="list-group mt-2">
                                            {category.subcategories.map((sub) => (
                                                <li key={sub.id} className="list-group-item d-flex justify-content-between align-items-center" data-testid={`subcategory-${sub.id}`}>
                                                    <span style={{ flexGrow: 1 }}>
                                                        {sub.name}
                                                    </span>
                                                    <div>
                                                        <button className="btn btn-sm btn-warning me-2" onClick={() => editItem(sub.id, sub.name, 'Subcategory', category.id)} data-testid={`edit-subcategory-${sub.id}`}>Edit</button>
                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteItem(sub.id, 'Subcategory')} data-testid={`delete-subcategory-${sub.id}`}>Delete</button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-9" data-testid="category-form">
                        <h2 data-testid="form-title">{editingItem.id ? 'Edit Category' : 'Create New Category'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="categoryName">Category Name:</label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    className="form-control"
                                    value={categoryName}
                                    onChange={handleCategoryNameChange}
                                    required
                                    data-testid="category-name-input"
                                />
                            </div>
                            <div className="form-group form-check">
                                <input
                                    type="checkbox"
                                    id="isSubCategory"
                                    className="form-check-input"
                                    checked={isSubCategory}
                                    onChange={handleCheckboxChange}
                                    data-testid="is-subcategory-checkbox"
                                />
                                <label htmlFor="isSubCategory" className="form-check-label">
                                    This is a sub-category
                                </label>
                            </div>
                            {isSubCategory && (
                                <div className="form-group position-relative">
                                    <label htmlFor="parentCategory">Parent Category:</label>
                                    <select
                                        id="parentCategory"
                                        className="form-control"
                                        value={selectedParentCategory}
                                        onChange={handleParentCategoryChange}
                                        required
                                        data-testid="parent-category-select"
                                    >
                                        <option value="">Select a parent category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="bi bi-chevron-down position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}></i>
                                </div>
                            )}
                            <button type="submit" className="btn btn-primary mt-2" data-testid="submit-button">
                                {editingItem.id ? 'Update Category' : 'Create Category'}
                            </button>
                            {editingItem.id && (
                                <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={resetForm} data-testid="cancel-button">
                                    Cancel
                                </button>
                            )}
                        </form>
                        {error && <p className="text-danger mt-3" data-testid="error-message">{error}</p>}
                        {success && <p className="text-success mt-3" data-testid="success-message">{success}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CategoryManagementPage;
