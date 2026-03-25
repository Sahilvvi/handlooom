import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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
            setSearchOpen(false);
            setMobileOpen(false);
        }
    };

    const isActive = (path) => location.pathname === path;
    const accountLink = user?.role === 'admin' ? '/admin' : '/account';

    return (
        <header className={`header-premium ${isScrolled ? 'scrolled' : ''}`}>
            <div className="announcement-bar-premium">
                <div className="container">
                    <p><span>✨</span> Free Premium Shipping Above ₹999 | <span>🚚</span> All India COD <span>🔄</span> 15-Day Luxury Returns</p>
                </div>
            </div>

            <div className="nav-main">
                <div className="container nav-container">
                    <div className="nav-left">
                        <Link to="/" className="branding" onClick={() => setMobileOpen(false)}>
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
                        <div className="action-icons">
                            <button className="search-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </button>

                            <Link to="/cart" className="action-btn" onClick={() => setMobileOpen(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </Link>

                            {user ? (
                                <Link to={accountLink} className="user-avatar-btn" onClick={() => setMobileOpen(false)}>
                                    <div className="user-circle">
                                        {user.firstName?.[0] || user.name?.[0]}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="action-btn" onClick={() => setMobileOpen(false)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </Link>
                            )}

                            <button className={`mobile-toggle-btn ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Full-Screen Search Modal */}
            <div className={`search-overlay-lux ${searchOpen ? 'visible' : ''}`}>
                <div className="search-modal-ux">
                    <button className="close-search" onClick={() => setSearchOpen(false)}>✕</button>
                    <div className="container">
                        <form onSubmit={handleSearch} className="search-form-lux">
                            <span className="search-tag">Luxury Discovery</span>
                            <div className="search-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Search the gallery..." 
                                    autoFocus={searchOpen} 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="submit">GO</button>
                            </div>
                            <div className="popular-lux">
                                <span>Popular:</span>
                                <Link to="/shop?search=Velvet" onClick={() => setSearchOpen(false)}>Velvet</Link>
                                <Link to="/shop?search=Silk" onClick={() => setSearchOpen(false)}>Silk</Link>
                                <Link to="/shop?search=Blackout" onClick={() => setSearchOpen(false)}>Blackout</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <div className={`mobile-nav-lux ${mobileOpen ? 'visible' : ''}`}>
                <div className="mobile-nav-panel-ux">
                    <nav className="mobile-links-ux">
                        <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                        <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop Signature</Link>
                        <Link to="/about" onClick={() => setMobileOpen(false)}>Heritage</Link>
                        <Link to="/contact" onClick={() => setMobileOpen(false)}>Experience</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
