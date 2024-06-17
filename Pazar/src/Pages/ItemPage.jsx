import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Form, InputGroup, Alert, ListGroup } from 'react-bootstrap';
import Navbar from "../Components/Navbar.jsx";
import api from '../Services/axiosInstance';

const conditionMap = {
    0: 'Like New',
    1: 'Used',
    2: 'Refurbished',
    3: 'New'
};

const statusMap = {
    0: 'Sold',
    1: 'Available',
    2: 'Pending',
    3: 'Bidding'
};

const bidDurationMap = {
    0: 'One day',
    1: 'Three days',
    2: 'Five days',
    3: 'Seven days',
    4: 'Fourteen days',
    5: 'Twenty one days',
    6: 'Thirty days'
};

const ItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [error, setError] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [bids, setBids] = useState([]);
    const [bidError, setBidError] = useState('');
    const webSocket = useRef(null);

    useEffect(() => {
        if (id) {
            fetchItem();
            checkIfUserIsSeller();
        } else {
            setError('Invalid item ID.');
        }

        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [id]);

    useEffect(() => {
        if (item) {
            fetchBids();
            initializeWebSocket();
        }
    }, [item]);

    const fetchItem = async () => {
        try {
            const response = await api.get(`/api/Item/${id}`);
            setItem(response.data);
        } catch (error) {
            setError(`Failed to fetch item details. ${error.response ? error.response.data.message : ''}`);
        }
    };

    const checkIfUserIsSeller = async () => {
        try {
            const response = await api.get(`/api/Item/${id}/isseller`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setIsSeller(response.data.isSeller);
        } catch (error) {
            console.error('Error checking if user is seller:', error);
        }
    };

    const fetchBids = async () => {
        try {
            const response = await api.get(`/ws/ItemBidding/bids/${id}`);
            setBids(response.data);
            console.log('Bids fetched:', response.data); // Debugging line
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    const initializeWebSocket = () => {
        webSocket.current = new WebSocket(`ws://localhost:5190/ws/ItemBidding`);
        webSocket.current.onopen = () => {
            console.log('WebSocket connection established');
            webSocket.current.send(JSON.stringify({ itemId: id }));
        };
        webSocket.current.onmessage = (message) => {
            try {
                const updatedBids = JSON.parse(message.data);
                setBids(updatedBids);
                console.log('WebSocket message received:', updatedBids); // Debugging line
            } catch (error) {
                console.error('Error parsing WebSocket message data:', error);
            }
        };
        webSocket.current.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            setTimeout(initializeWebSocket, 1000);
        };
        webSocket.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const handleBid = async () => {
        setBidError('');
        try {
            await api.post(`/ws/ItemBidding/newbid`, {
                itemID: id,
                bid: parseFloat(bidAmount)
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setBidAmount('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.Message) {
                setBidError(error.response.data.Message);
            } else {
                setBidError('Failed to place bid.');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit-item/${id}`);
    };

    const handleRemoveOffer = async () => {
        const confirmDelete = window.confirm('Are you sure you want to remove this offer?');
        if (confirmDelete) {
            try {
                await api.delete(`/api/Item/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                alert('Offer successfully removed.');
                navigate('/'); // Redirect to home page or any other page
            } catch (error) {
                alert('Failed to remove offer.');
            }
        }
    };

    const calculateRemainingTime = (createdAt, bidDuration) => {
        const createdDate = new Date(createdAt);
        const endDate = new Date(createdDate);
        switch (bidDuration) {
            case 0:
                endDate.setDate(createdDate.getDate() + 1);
                break;
            case 1:
                endDate.setDate(createdDate.getDate() + 3);
                break;
            case 2:
                endDate.setDate(createdDate.getDate() + 5);
                break;
            case 3:
                endDate.setDate(createdDate.getDate() + 7);
                break;
            case 4:
                endDate.setDate(createdDate.getDate() + 14);
                break;
            case 5:
                endDate.setDate(createdDate.getDate() + 21);
                break;
            case 6:
                endDate.setDate(createdDate.getDate() + 30);
                break;
            default:
                break;
        }
        const now = new Date();
        const remainingTime = endDate - now;
        if (remainingTime <= 0) {
            return 'Bidding ended';
        } else {
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            return `${days}d ${hours}h ${minutes}m left`;
        }
    };

    const getHighestBid = () => {
        return bids.length > 0 ? Math.max(...bids.map(bid => bid.Bid)) : 0;
    };

    const getMinBid = () => {
        const highestBid = getHighestBid();
        return highestBid ? (highestBid + 1).toString() : '1';
    };

    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <Container>
                <Row className="my-5">
                    <Col md={6}>
                        <Card>
                            <Card.Img variant="top" src={item?.images[0] || '/path/to/default-image.jpg'} />
                        </Card>
                        <Row className="mt-3">
                            {item?.images.slice(1).map((image, index) => (
                                <Col key={index} xs={6} md={4}>
                                    <Card>
                                        <Card.Img variant="top" src={image} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col md={6}>
                        <h2>{item?.name}</h2>
                        <p>{item?.description}</p>
                        {!item?.bidOnly && <h3>€{item?.price}</h3>}
                        <p>Condition: {conditionMap[item?.condition]}</p>
                        <p>Status: {statusMap[item?.status]}</p>
                        <p>Date listed: {new Date(item?.createdAt).toLocaleDateString()}</p>
                        <p>Seller: {item?.seller.name} {item?.seller.surname}</p>
                        {item?.bidOnly && (
                            <>
                                <p>Bid Duration: {bidDurationMap[item?.bidDuration]}</p>
                                <p>Time Left: {calculateRemainingTime(item?.createdAt, item?.bidDuration)}</p>
                                <h3>Bids:</h3>
                                {bids.length > 0 ? (
                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                                        {bids
                                            .sort((a, b) => new Date(b.BidTime) - new Date(a.BidTime))
                                            .map((bid, index) => (
                                                <ListGroup.Item key={index}>
                                                    {bid.BidderName}: €{bid.Bid}
                                                </ListGroup.Item>
                                            ))}
                                    </ListGroup>
                                ) : (
                                    <p>No bids yet.</p>
                                )}
                                {!isSeller && calculateRemainingTime(item?.createdAt, item?.bidDuration) !== 'Bidding ended' && (
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Bid Amount</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>€</InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    min={getMinBid()}
                                                />
                                            </InputGroup>
                                            {bidError && <Alert variant="danger" className="mt-2">{bidError}</Alert>}
                                        </Form.Group>
                                        <Button variant="primary" onClick={handleBid} className="mt-2">Place Bid</Button>
                                    </Form>
                                )}
                            </>
                        )}
                        {isSeller ? (
                            <>
                                <Button variant="warning" className="mt-2" onClick={handleEdit}>Edit Offer</Button>
                                <Button variant="danger" className="mt-2" onClick={handleRemoveOffer}>Remove Offer</Button>
                            </>
                        ) : (
                            item?.status !== 0 && (!item?.bidOnly || (item?.bidOnly && calculateRemainingTime(item?.createdAt, item?.bidDuration) !== 'Bidding ended')) && (
                                <Button variant="secondary" className="mt-2">Message Seller</Button>
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ItemPage;
