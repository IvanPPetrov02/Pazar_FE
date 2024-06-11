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
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
                <div className="mr-auto" style={{ marginLeft: '20px' }}>
                    <a className="navbar-brand" href="/">
                        <img src="/Pazar_logo.png" alt="Pazar" style={{ height: '30px' }} />
                    </a>
                </div>

                {/* Search and CategoryMenu for large screens */}
                <div className="mx-auto d-none d-lg-flex align-items-center">
                    <CategoryMenu />
                    <div style={{ marginLeft: '20px' }}>
                        {searchExpanded ? (
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                onBlur={() => setSearchExpanded(false)}
                                autoFocus
                            />
                        ) : (
                            <button className="btn btn-outline-success" type="button" onClick={toggleSearch}>
                                <img src="/search.png" alt="Search" style={{ width: '24px' }} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Authentication buttons */}
                <div className="ml-auto" style={{ marginRight: '20px' }}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="btn btn-link">Profile</Link>
                            {user && user.role === 1 && (
                                <Link to="/create-category" className="btn btn-link">Manage Categories</Link>
                            )}
                            <button className="btn btn-link" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-link">Login</Link>
                    )}
                </div>
            </nav>

            {/* Search and CategoryMenu for small screens */}
            <div className="d-lg-none text-center">
                <div className="d-flex justify-content-around align-items-center">
                    <div style={{ width: '45%' }}>
                        <CategoryMenu />
                    </div>
                    {searchExpanded ? (
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            onBlur={() => setSearchExpanded(false)}
                            autoFocus
                        />
                    ) : (
                        <div style={{ width: '45%' }}>
                            <button className="btn btn-outline-success" type="button" onClick={toggleSearch}>
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
