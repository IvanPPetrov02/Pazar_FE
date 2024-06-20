import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import api from '../Services/axiosInstance';

function ChatPage() {
    let { itemId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [setSellerId] = useState(null);
    const [loading, setLoading] = useState(true);
    let socket;

    useEffect(() => {
        console.log('itemId from useParams:', itemId);
        if (itemId) {
            initializeChat();
        } else {
            console.error('itemId is undefined');
        }
    }, [itemId]);

    const initializeChat = async () => {
        try {
            // Fetch the current user's ID
            const userId = await fetchCurrentUser();
            setUserId(userId);

            // Fetch item details to get the seller's ID
            const sellerId = await fetchItemDetails(itemId);
            setSellerId(sellerId);

            // Create or get the chat
            const chatId = await createOrGetChat(itemId, userId);
            setChatId(chatId);

            // Fetch existing messages for the chat
            const messages = await fetchMessages(chatId);
            setMessages(messages);

            // Initialize WebSocket
            initializeWebSocket(chatId);

            setLoading(false);
        } catch (error) {
            console.error('Error initializing chat:', error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await api.get('/api/User/GetUser', {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.uuid; // Ensure this is the correct property for user ID
        } catch (error) {
            console.error('Error fetching current user:', error);
            throw error;
        }
    };

    const fetchItemDetails = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await api.get(`/api/Item/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.seller.uuid; // Ensure this is the correct property for seller ID
        } catch (error) {
            console.error('Error fetching item details:', error);
            throw error;
        }
    };

    const createOrGetChat = async (itemId, userId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const payload = {
                ItemSoldId: itemId,
                BuyerId: userId,
                MessageSent: "" // Initially no message to send, just to create the chat
            };

            console.log('Sending payload to createOrGetChat:', payload);

            const response = await api.post('/api/chat', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.chatId;
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
            } else {
                // Something else caused the error
                console.error('Error message:', error.message);
            }
            console.error('Error config:', error.config);
            throw error;
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await api.get(`/api/chat/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    };

    const initializeWebSocket = (chatId) => {
        socket = new WebSocket(`ws://localhost:5000/ws/messages`);

        socket.onopen = () => {
            console.log('WebSocket connection established');
            socket.send(JSON.stringify({ chatId }));
        };

        socket.onmessage = (event) => {
            const receivedMessages = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, ...receivedMessages]);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    };

    const sendMessage = () => {
        if (input && socket.readyState === WebSocket.OPEN) {
            const message = {
                chatId,
                itemSoldId: itemId,
                buyerId: userId,
                messageSent: input
            };
            socket.send(JSON.stringify(message));
            setInput('');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container my-3">
                <h2>Chat</h2>
                <p>Chat for item ID: {itemId}</p>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.senderName}</strong>: {msg.messageSent}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <Footer />
        </>
    );
}

export default ChatPage;
