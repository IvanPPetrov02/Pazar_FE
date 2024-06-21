import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Services/AuthProvider';
import CategoryMenu from './CategoryMenu';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const [searchExpanded, setSearchExpanded] = useState(false);

    const toggleSearch = () => setSearchExpanded(!searchExpanded);

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between" data-testid="navbar">
                <div className="mr-auto" style={{ marginLeft: '20px' }}>
                    <a className="navbar-brand" href="/" data-testid="logo">
                        <img src="/Pazar_logo.png" alt="Pazar" style={{ height: '30px' }} />
                    </a>
                </div>

                {/* Search and CategoryMenu for large screens */}
                <div className="mx-auto d-none d-lg-flex align-items-center">
                    <CategoryMenu data-testid="category-menu" />
                    <div style={{ marginLeft: '20px' }}>
                        {searchExpanded ? (
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                onBlur={() => setSearchExpanded(false)}
                                autoFocus
                                data-testid="search-input"
                            />
                        ) : (
                            <button className="btn btn-outline-success" type="button" onClick={toggleSearch} data-testid="search-button">
                                <img src="/search.png" alt="Search" style={{ width: '24px' }} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Authentication buttons */}
                <div className="ml-auto" style={{ marginRight: '20px' }}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="btn btn-link" data-testid="profile-button">Profile</Link>
                            {user && user.role === 1 && (
                                <Link to="/category-management" className="btn btn-link" data-testid="category-management-button">Manage Categories</Link>
                            )}
                            <Link to="/create-item" className="btn btn-link" data-testid="create-item-button">Add Item for sale</Link>
                            <button className="btn btn-link" onClick={logout} data-testid="logout-button">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-link" data-testid="login-button">Login</Link>
                    )}
                </div>
            </nav>

            {/* Search and CategoryMenu for small screens */}
            <div className="d-lg-none text-center">
                <div className="d-flex justify-content-around align-items-center">
                    <div style={{ width: '45%' }}>
                        <CategoryMenu data-testid="category-menu-mobile" />
                    </div>
                    {searchExpanded ? (
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onBlur={() => setSearchExpanded(false)}
                            autoFocus
                            data-testid="search-input-mobile"
                        />
                    ) : (
                        <div style={{ width: '45%' }}>
                            <button className="btn btn-outline-success" type="button" onClick={toggleSearch} data-testid="search-button-mobile">
                                <img src="/search.png" alt="Search" style={{ width: '20px' }} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
