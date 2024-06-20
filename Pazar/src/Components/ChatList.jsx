import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';


const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await api.get(`/api/chat`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const chatList = response.data;
            const updatedChats = await Promise.all(
                chatList.map(async (chat) => {
                    if (chat.itemSoldId) {
                        try {
                            const itemResponse = await api.get(`/api/item/${chat.itemSoldId}`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });
                            return { ...chat, item: itemResponse.data, seller: itemResponse.data.seller };
                        } catch (error) {
                            console.error(`Error fetching item for chat ID ${chat.id}:`, error);
                            return { ...chat, item: null, seller: null };
                        }
                    } else {
                        console.warn(`Chat ID ${chat.id} has no associated itemSoldId`);
                        return { ...chat, item: null, seller: null };
                    }
                })
            );

            setChats(updatedChats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chats or items:', error);
            setLoading(false);
        }
    };

    const handleChatSelect = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Chats</h2>
            <ul className="list-group">
                {chats.map((chat) => (
                    <li
                        key={chat.id}
                        className="list-group-item chat-list-item"
                        onClick={() => handleChatSelect(chat.id)}
                    >
                        <div className="chat-item-name">{chat.item ? chat.item.name : 'Unknown'}</div>
                        <div className="chat-seller-name">Seller: {chat.seller ? chat.seller.name : 'Unknown'}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
