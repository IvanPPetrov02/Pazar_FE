import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import Navbar from "../Components/Navbar.jsx";


const itemData = {
    name: 'Vintage Leather Jacket',
    description: 'A well-loved vintage leather jacket in good condition. Fits like a medium.',
    price: 100,
    images: ['/path/to/image1.jpg', '/path/to/image2.jpg'],
    condition: 'Good',
    status: 'Available',
    createdAt: '2024-04-01',
};


function ItemPage() {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
        <Container>
            <Row className="my-5">
                <Col md={6}>
                    {/* Display first image as main image */}
                    <Card>
                        <Card.Img variant="top" src={itemData.images[0]} />
                    </Card>
                    {/* Mini gallery for additional images */}
                    <Row>
                        {itemData.images.slice(1).map((image, index) => (
                            <Col key={index} xs={6} md={4}>
                                <Card>
                                    <Card.Img variant="top" src={image} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col md={6}>
                    <h2>{itemData.name}</h2>
                    <p>{itemData.description}</p>
                    <h3>${itemData.price}</h3>
                    <p>Condition: {itemData.condition}</p>
                    <p>Status: {itemData.status}</p>
                    <p>Date listed: {itemData.createdAt}</p>
                    <Button variant="primary">Bid</Button>{' '}
                    <Button variant="secondary">Message Seller</Button>
                </Col>
            </Row>
        </Container>
        </div>
    );
}

export default ItemPage;