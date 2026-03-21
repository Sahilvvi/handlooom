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
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="announcement-bar">
                <span>✨ Free Premium Shipping Above ₹999</span>
                <span className="separator">|</span>
                <span>🚚 COD Available Across India</span>
                <span className="separator">|</span>
                <span>🔄 15-Day Easy Returns</span>
            </div>

            <div className="header-main">
                <div className="container header-container">
                    <div className="header-left">
                        <Link to="/" className="logo" onClick={closeMenu}>
                            <img src="/logo.png" alt="Jannat Handloom" className="logo-img" />
                        </Link>
                    </div>

                    <div className="header-center">
                        <nav className="nav-desktop">
                            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                            <Link to="/shop" className={isActive('/shop') ? 'active' : ''}>Shop</Link>
                            <Link to="/about" className={isActive('/about') ? 'active' : ''}>Our Story</Link>
                            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>
                        </nav>
                    </div>

                    <div className="header-right">
                        <form className="search-minimal" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </button>
                        </form>

                        <div className="header-icons">
                            <Link to="/cart" className="icon-btn cart-icon" onClick={closeMenu}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
                            </Link>

                            {user ? (
                                <Link to={accountLink} className="user-icon" onClick={closeMenu}>
                                    <div className="avatar-small">
                                        {user.firstName?.[0] || user.name?.[0]}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="icon-btn" onClick={closeMenu}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </Link>
                            )}

                            <button
                                className={`hamburger-menu ${mobileOpen ? 'open' : ''}`}
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Mobile Navigation */}
            <div className={`mobile-navigation ${mobileOpen ? 'open' : ''}`}>
                <div className="mobile-nav-content">
                    <div className="mobile-nav-links">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/shop" onClick={closeMenu}>Shop</Link>
                        <Link to="/about" onClick={closeMenu}>Our Story</Link>
                        <Link to="/contact" onClick={closeMenu}>Contact Us</Link>
                    </div>
                    {user && (
                      <div className="mobile-user-footer">
                        <Link to={accountLink} onClick={closeMenu}>My Account ({user.firstName})</Link>
                      </div>
                    )}
                </div>
            </div>
            {mobileOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
        </header>
    );
};

export default Header;
