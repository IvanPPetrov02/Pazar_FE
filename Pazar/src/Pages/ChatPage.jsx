import { useEffect, useState, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import api from '../Services/axiosInstance';
import { Alert, ListGroup, Form, Button } from 'react-bootstrap';
import Navbar from '../Components/Navbar.jsx';
import Footer from '../Components/Footer.jsx';

const ChatPage = () => {
    const { id: chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState({});
    const [loggedInUserId, setLoggedInUserId] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (chatId) {
            const fetchMessages = async () => {
                try {
                    const response = await api.get(`/api/message/${chatId}`);
                    setMessages(response.data);
                    scrollToBottom();
                } catch (error) {
                    setError(`Failed to fetch messages: ${error.response?.data?.Message || error.message}`);
                }
            };

            fetchMessages();
        } else {
            setError('Chat ID is missing.');
        }
    }, [chatId]);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/api/user/getuser', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLoggedInUserId(response.data.uuid);
            } catch (error) {
                setError(`Failed to fetch logged in user: ${error.response?.data?.Message || error.message}`);
            }
        };

        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const fetchUserIfNeeded = async (userId) => {
            if (!users[userId]) {
                try {
                    const response = await api.get(`/api/user/${userId}`);
                    setUsers((prevUsers) => ({
                        ...prevUsers,
                        [userId]: response.data.name,
                    }));
                } catch (error) {
                    console.error(`Failed to fetch user ${userId}: ${error.message}`);
                }
            }
        };

        messages.forEach((msg) => {
            fetchUserIfNeeded(msg.senderId);
        });
    }, [messages]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5190/messageHub', {
                accessTokenFactory: () => localStorage.getItem('token')
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop().catch(err => console.error('Error stopping connection:', err));
            }
        };
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR');
                    connection.invoke('JoinChat', parseInt(chatId))
                        .catch(err => console.error('Error joining chat:', err));

                    connection.on('ReceiveMessage', (message) => {
                        setMessages(prevMessages => [...prevMessages, message]);
                        scrollToBottom();
                    });
                })
                .catch(err => {
                    console.error('Error connecting to SignalR:', err);
                    setError('Could not connect to chat.');
                });
        }
    }, [connection, chatId]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const sendMessage = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to send messages.');
            return;
        }

        try {
            const response = await api.get('/api/user/getuser', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userId = response.data.uuid;

            const messageDto = {
                ChatId: parseInt(chatId),
                SenderId: userId,
                MessageSent: message,
                SentAt: new Date().toISOString()
            };

            await connection.invoke('SendMessage', messageDto);
            setMessage('');
        } catch (error) {
            setError(`Failed to send message: ${error.message}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 d-flex flex-column">
                <h2>Chat</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <div
                    className="flex-grow-1 overflow-auto mb-3"
                    ref={messagesContainerRef}
                    style={{ maxHeight: '400px', display: 'flex', flexDirection: 'column-reverse' }}
                >
                    <ListGroup>
                        {messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)).map((msg, index) => (
                            <ListGroup.Item key={index}>
                                <strong>{msg.senderId === loggedInUserId ? 'You' : users[msg.senderId] || msg.senderId}:</strong> {msg.messageSent}
                                <div className="text-muted small">
                                    {new Date(msg.sentAt).toLocaleString()}
                                </div>
                            </ListGroup.Item>
                        ))}
                        <div ref={messagesEndRef} />
                    </ListGroup>
                </div>
                <Form>
                    <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={sendMessage}>Send</Button>
                </Form>
            </div>
            <Footer />
        </div>
    );
};

export default ChatPage;
