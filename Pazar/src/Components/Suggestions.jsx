import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Slider from "react-slick";
import api from "../Services/axiosInstance.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Suggestions() {
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {

        const fetchSubCategories = async () => {
            try {
                const response = await api.get('/api/Category/GetRandomSubCategories'); // Updated endpoint
                setSubCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch subcategories:', error);
            }
        };
        fetchSubCategories();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <button type="button" className="slick-next" style={{ color: 'white', backgroundColor: 'black', position: 'absolute', top: '50%', left: '-2%' }}>Next</button>, // Updated styles
        nextArrow: <button type="button" className="slick-prev" style={{ color: 'white', backgroundColor: 'black', position: 'absolute', top: '50%', right: '-2%' }}>Prev</button>  // Updated styles
    };

    return (
        <section className="suggestions p-3">
            <h2>Suggested Sub-categories</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}> {/* Add position: 'relative' */}
                <Slider {...settings}>
                    {subCategories.map((subCategory, index) => (
                        <div key={index}>
                            <Link to={`/categories/${subCategory.id}/items`}> {/* Add this Link */}
                                <h3>{subCategory.name}</h3> {/* Access the name property of the subCategory object */}
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default Suggestions;