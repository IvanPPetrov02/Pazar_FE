import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import ItemPage from './Pages/ItemPage.jsx';
import CategoriesPage from './Pages/CategoriesPage.jsx';
import ItemsPage from './Pages/ItemsPage.jsx';
import MessagesPage from './Pages/MessagesPage.jsx';
import AddItemPage from './Pages/AddItemPage.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import AuthPage from './Pages/AuthPage.jsx';
//import NotFoundPage from './Pages/NotFoundPage.jsx'; // A fallback for undefined routes

function App() {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/categories/:categoryId/items/:itemId" element={<ItemPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId/items" element={<ItemsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/add-item" element={<AddItemPage />} />
            <Route path="/chat/:messageId" element={<ChatPage />} />
            <Route path="/" element={<HomePage />} />
            {/*<Route path="*" element={<NotFoundPage />} /> /!* Fallback for undefined routes *!/*/}
        </Routes>
    );
}

export default App;
