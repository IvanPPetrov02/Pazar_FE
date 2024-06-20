import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import api from "../Services/axiosInstance.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import arrowIcon from "../../public/arrowIcon.png";

function Suggestions() {
    const [subCategories, setSubCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await api.get('/api/Category/GetRandomSubCategories');
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
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: (
            <div
                style={{
                    position: 'absolute',
                    left: '-25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                }}
            >
                <img
                    src={arrowIcon}
                    alt="Previous"
                    style={{
                        transform: 'rotate(90deg)',
                        width: '20px',
                        height: '20px',
                    }}
                />
            </div>
        ),
        nextArrow: (
            <div
                style={{
                    position: 'absolute',
                    right: '-25px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                }}
            >
                <img
                    src={arrowIcon}
                    alt="Next"
                    style={{
                        transform: 'rotate(-90deg)',
                        width: '20px',
                        height: '20px',
                    }}
                />
            </div>
        )
    };

    const handleNavigation = (subCategoryId) => {
        navigate(`/categories/${subCategoryId}/items`);
    };

    return (
        <section className="suggestions p-3">
            <h2>Suggested Sub-categories</h2>
            <div className="container" style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                <Slider {...settings}>
                    {subCategories.map((subCategory, index) => (
                        <div
                            key={index}
                            className="text-center"
                            style={{ cursor: 'pointer', padding: '10px' }}
                            onClick={() => handleNavigation(subCategory.id)}
                        >
                            <h3>{subCategory.name}</h3>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default Suggestions;
