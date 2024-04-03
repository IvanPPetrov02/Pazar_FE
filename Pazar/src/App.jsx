import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import { ItemPage } from "./Pages/ItemPage.jsx";
import CategoriesPage from "./Pages/CategoriesPage.jsx";

// Define your routes within the App component
function App() {
    const router = createBrowserRouter([
        { path: '/', element: <HomePage /> },
        { path: '/Items/:itemId', element: <ItemPage /> },
        {path: '/categories', element: <CategoriesPage />}
    ]);

    return <RouterProvider router={router} />;
}

export default App;
