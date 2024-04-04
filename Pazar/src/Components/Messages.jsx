import React from 'react';
import { Link } from 'react-router-dom';

function Messages() {
    // Example messages. In a real app, these would be fetched from a server.
    const messages = [
        { id: 1, item: 'Item 1', from: 'User A', lastMessage: 'Hello, I would like to know more about Item 1.' },
        { id: 2, item: 'Item 2', from: 'User B', lastMessage: 'Can we discuss the price for Item 2?' },
        // ... more messages
    ];

    return (
        <div>
            <h2>Messages</h2>
            <ul className="list-group">
                {messages.map((message) => (
                    <Link to={`/chat/${message.id}`} key={message.id} className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{message.item}</h5>
                            <small>From: {message.from}</small>
                        </div>
                        <p className="mb-1">{message.lastMessage}</p>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default Messages;
