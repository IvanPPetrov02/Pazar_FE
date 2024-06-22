import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoggedUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user]);

    const fetchLoggedUser = async () => {
        try {
            const response = await api.get(`/api/user/getuser`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
            console.log("Fetched User:", response.data);
        } catch (error) {
            console.error('Error fetching logged user:', error);
        }
    };

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
                            const item = itemResponse.data;

                            const isSellerResponse = await api.get(`/api/item/${chat.itemSoldId}/isseller`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                }
                            });

                            const isSeller = isSellerResponse.data.isSeller;

                            const buyerResponse = await fetchUser(chat.buyerId);
                            const buyer = buyerResponse ? buyerResponse : null;

                            return { ...chat, item, buyer, seller: item.seller, isSeller };
                        } catch (error) {
                            console.error(`Error fetching item for chat ID ${chat.id}:`, error);
                            return { ...chat, item: null, buyer: null, seller: null, isSeller: false };
                        }
                    } else {
                        console.warn(`Chat ID ${chat.id} has no associated itemSoldId`);
                        return { ...chat, item: null, buyer: null, seller: null, isSeller: false };
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

    const fetchUser = async (userId) => {
        try {
            const response = await api.get(`/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching user by ID ${userId}:`, error);
            return null;
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
            <ul className="list-group">
                {chats.map((chat) => {
                    const otherUser = chat.isSeller ? chat.buyer : chat.seller;
                    const otherUserName = otherUser ? `${otherUser.name} ${otherUser.surname}` : 'Unknown';
                    const itemDescription = chat.isSeller ? `About your item: ${chat.item ? chat.item.name : 'Unknown'}` : `${chat.item ? chat.item.name : 'Unknown'}`;
                    return (
                        <li
                            key={chat.id}
                            className="list-group-item chat-list-item"
                            onClick={() => handleChatSelect(chat.id)}
                        >
                            <div className="chat-item-name">{itemDescription}</div>
                            <div className={`chat-${chat.isSeller ? 'buyer' : 'seller'}-name`}>
                                {chat.isSeller ? 'Potential Buyer' : 'Seller'}: {otherUserName}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatList;
