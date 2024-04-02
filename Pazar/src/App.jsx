import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import { Item } from "./Pages/Item.jsx";

// Define your routes within the App component
function App() {
    const router = createBrowserRouter([
        { path: '/', element: <HomePage /> },
        { path: '/Items/:itemId', element: <Item /> },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
