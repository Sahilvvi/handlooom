import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const accountLink = user?.role === 'admin' ? '/admin' : '/account';

  return (
    <header className="header">
      <div className="announcement-bar">
        Free Shipping Above ₹999 | COD Available | Easy Returns
      </div>
      <div className="header-top">
        <div className="container header-container">
          <div className="header-left">
            <Link to="/" className="logo">
              <h1>JANNAT</h1>
              <span>HANDLOOM</span>
            </Link>
          </div>

          <div className="header-center">
            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search Curtains, Colors & More..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </form>
          </div>

          <div className="header-right">
            <Link to="/cart" className="header-action-item cart-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            {user ? (
              <Link to={accountLink} className="header-action-item">
                <div className="user-avatar-mini">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                <span>{user.firstName}</span>
              </Link>
            ) : (
              <Link to="/login" className="header-action-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="header-nav">
        <div className="container">
          <nav className="nav-main">
            <Link to="/">Home</Link>
            <Link to="/shop">Products</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
