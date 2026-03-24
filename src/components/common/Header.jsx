import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setMobileOpen(false);
        }
    };

    const accountLink = user?.role === 'admin' ? '/admin' : '/account';
    const closeMenu = () => setMobileOpen(false);

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`header-premium ${isScrolled ? 'scrolled' : ''}`}>
            <div className="announcement-bar-premium">
                <div className="container">
                    <p><span>✨</span> Free Premium Shipping Above ₹999 | <span>🚚</span> All India COD <span>🔄</span> 15-Day Luxury Returns</p>
                </div>
            </div>

            <div className={`nav-main ${isScrolled ? 'glass' : ''}`}>
                <div className="container nav-container">
                    <div className="nav-left">
                        <Link to="/" className="branding" onClick={closeMenu}>
                            <h2 className="brand-name">Jannat <span>Handloom</span></h2>
                        </Link>
                    </div>

                    <nav className="nav-center-desktop">
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>Shop</Link>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>Our Story</Link>
                        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Experience</Link>
                    </nav>

                    <div className="nav-right">
                        <form className="search-bar-premium" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search collection..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" aria-label="Search">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </button>
                        </form>

                        <div className="action-icons">
                            <Link to="/cart" className="action-btn cart-btn" onClick={closeMenu}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </Link>

                            {user ? (
                                <Link to={accountLink} className="user-avatar-btn" onClick={closeMenu}>
                                    <div className="user-circle">
                                        {user.firstName?.[0] || user.name?.[0]}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="action-btn" onClick={closeMenu}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </Link>
                            )}

                            <button
                                className={`mobile-toggle-btn ${mobileOpen ? 'active' : ''}`}
                                onClick={() => setMobileOpen(!mobileOpen)}
                                aria-label="Toggle Navigation"
                            >
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Mobile Menu Overlay */}
            <div className={`mobile-nav-overlay ${mobileOpen ? 'visible' : ''}`}>
                <div className="mobile-nav-panel">
                    <nav className="mobile-links">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/shop" onClick={closeMenu}>Shop Collection</Link>
                        <Link to="/about" onClick={closeMenu}>Our Story</Link>
                        <Link to="/contact" onClick={closeMenu}>Contact Experience</Link>
                    </nav>
                    <div className="mobile-utility">
                        {user ? (
                            <Link to={accountLink} className="user-info-mobile" onClick={closeMenu}>
                                <div className="user-circle-mobile">{(user.firstName || user.name)?.[0]}</div>
                                <span>Manage Account</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="login-btn-mobile" onClick={closeMenu}>Sign In / Join</Link>
                        )}
                    </div>
                </div>
                <div className="overlay-blur" onClick={closeMenu}></div>
            </div>
        </header>
    );
};

export default Header;
