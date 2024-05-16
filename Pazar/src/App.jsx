import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import { ItemPage } from "./Pages/ItemPage.jsx";
import CategoriesPage from "./Pages/CategoriesPage.jsx";
import ItemsPage from "./Pages/ItemsPage.jsx";
import MessagesPage from "./Pages/MessagesPage.jsx";
import AddItemPage from "./Pages/AddItemPage.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import AuthContext from './AuthContext';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = createBrowserRouter([
        { path: '/', element: <HomePage /> },
        { path: '/categories/:categoryId/items/:itemId', element: <ItemPage /> },
        { path: '/categories', element: <CategoriesPage />},
        { path: '/categories/:categoryId/items', element: <ItemsPage /> },
        { path: '/messages', element: <MessagesPage /> },
        { path: '/add-item', element: <AddItemPage /> },
        { path: '/chat/:messageId', element: <ChatPage /> },
    ]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <RouterProvider router={router} />
        </AuthContext.Provider>
    );
}

export default App;