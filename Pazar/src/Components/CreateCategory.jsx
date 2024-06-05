import { useState, useEffect } from 'react';
import api from '../Services/axiosInstance';

const CreateCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [isSubCategory, setIsSubCategory] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await api.get('/api/Category/GetCategories');
                setParentCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch parent categories:', error);
            }
        };

        fetchParentCategories();
    }, []);

    const handleCategoryNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        setIsSubCategory(e.target.checked);
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
            await api.post('/api/Category', categoryData);
            setSuccess('Category created successfully!');
        } catch (error) {
            setError('Failed to create category. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Create New Category</h2>
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
                    />
                </div>
                <div className="form-group form-check">
                    <input
                        type="checkbox"
                        id="isSubCategory"
                        className="form-check-input"
                        checked={isSubCategory}
                        onChange={handleCheckboxChange}
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
                        >
                            <option value="">Select a parent category</option>
                            {parentCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <i className="bi bi-chevron-down position-absolute" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}></i>
                    </div>
                )}
                <button type="submit" className="btn btn-primary">
                    Create Category
                </button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            {success && <p className="text-success mt-3">{success}</p>}
        </div>
    );
};

export default CreateCategory;
