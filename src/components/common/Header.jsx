import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="header">
      <div className="announcement-bar">
        Free Shipping Above ₹999 | COD Available
      </div>
      <div className="header-main">
        <div className="container header-container">
          <div className="header-left">
            <button className="menu-toggle" aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <nav className="nav-desktop">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/collections">Collections</Link>
              {user?.role === 'admin' && <Link to="/admin" style={{ color: 'var(--accent-sage)', fontWeight: 'bold', marginLeft: '20px' }}>Dashboard</Link>}
            </nav>
          </div>

          <div className="header-center">
            <a href="/" className="logo">
              <h1>JANNAT</h1>
              <span>HANDLOOM</span>
            </a>
          </div>

          <div className="header-right">
            <button className="header-icon" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button className="header-icon" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
            <button className="header-icon cart-icon" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span className="cart-count">0</span>
            </button>
          </div>
        </div>
      </div>
      <div className="nav-secondary">
        <div className="container">
          <nav className="nav-links-secondary">
            <a href="/category/blackout">By Room</a>
            <a href="/category/sheer">New Arrivals</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
