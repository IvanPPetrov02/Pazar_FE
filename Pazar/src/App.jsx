import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage.jsx';
import ItemPage from './Pages/ItemPage.jsx';
import ItemsPage from './Pages/ItemsPage.jsx';
import MessagesPage from './Pages/MessagesPage.jsx';
import ChatPage from './Pages/ChatPage.jsx';
import AuthPage from './Pages/AuthPage.jsx';
import { AuthProvider } from './Services/AuthProvider.jsx';
import ProtectedRoute from './Services/ProtectedRoute.jsx';
import LogoutButton from './Components/LogoutButton.jsx';
import AdminRoute from "./Services/AdminRoute.jsx";
import CategoryManagmentPage from "./Pages/CategoryManagmentPage.jsx";
import ItemCreationPage from "./Pages/ItemCreationPage.jsx";
import PublicRoute from './Services/PublicRoute.jsx';
import EditItemPage from './Pages/EditItemPage.jsx';
import OwnerRoute from "./Services/OwnerRoute.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
                <Route path="/item/:id" element={<ItemPage />} />
                <Route path="/categories/:categoryId/items" element={<ItemsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/logout" element={<ProtectedRoute><LogoutButton /></ProtectedRoute>} />
                <Route path="/category-management" element={<AdminRoute><CategoryManagmentPage /></AdminRoute>} />
                <Route path="/create-item" element={<ProtectedRoute><ItemCreationPage /></ProtectedRoute>} />
                <Route path="/edit-item/:id" element={<OwnerRoute><EditItemPage /></OwnerRoute>} />
                {/* <Route path="*" element={<NotFoundPage />} /> {/* Fallback for undefined routes */}
            </Routes>
        </AuthProvider>
    );
}

export default App;
