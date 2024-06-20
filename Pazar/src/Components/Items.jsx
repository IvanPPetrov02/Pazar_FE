import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../Services/axiosInstance';

const conditionMap = {
    0: 'Like New',
    1: 'Used',
    2: 'Refurbished',
    3: 'New'
};

function Items() {
    const { categoryId } = useParams();
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                let response = await api.get(`/api/Item/category/${categoryId}`);
                if (response.data.length === 0) {
                    response = await api.get(`/api/Item/subcategory/${categoryId}`);
                }
                setItems(response.data);
                if (response.data.length === 0) {
                    setError('Currently no items available in this category.');
                }
            } catch (error) {
                setError('Failed to fetch items.');
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [categoryId]);

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <section className="items-list p-3">
            <h2>Items for Sale</h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="row">
                {items.map((item) => (
                    <div key={item.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title text-truncate">{item.name}</h5>
                                <p className="card-text">
                                    <strong>Price:</strong> {item.bidOnly ? 'Biddable' : item.price ? `€${item.price}` : 'Free'}
                                </p>
                                <p className="card-text">
                                    <strong>Condition:</strong> {conditionMap[item.condition]}
                                </p>
                                <Link to={`/item/${item.id}`} className="btn btn-primary">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Items;