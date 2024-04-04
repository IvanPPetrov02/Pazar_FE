import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import { ItemPage } from "./Pages/ItemPage.jsx";
import CategoriesPage from "./Pages/CategoriesPage.jsx";
import ItemsPage from "./Pages/ItemsPage.jsx";
import MessagesPage from "./Pages/MessagesPage.jsx";
import AddItemPage from "./Pages/AddItemPage.jsx";


function App() {
    const router = createBrowserRouter([
        { path: '/', element: <HomePage /> },
        { path: '/categories/:categoryId/items/:itemId', element: <ItemPage /> },
        { path: '/categories', element: <CategoriesPage />},
        { path: '/categories/:categoryId/items', element: <ItemsPage /> },
        { path: '/messages', element: <MessagesPage /> },
        { path: '/add-item', element: <AddItemPage /> }
    ]);

    return <RouterProvider router={router} />;
}

export default App;
