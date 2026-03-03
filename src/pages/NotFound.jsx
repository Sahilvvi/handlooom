import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
    <div className="notfound-page">
        <div className="notfound-content">
            <div className="notfound-emoji">🧵</div>
            <h1 className="notfound-code">404</h1>
            <h2 className="notfound-title">Page Not Found</h2>
            <p className="notfound-desc">
                Oops! The page you're looking for doesn't exist or has been moved.
                Let's get you back to our beautiful curtain collection.
            </p>
            <div className="notfound-actions">
                <Link to="/" className="btn-go-home">Go to Homepage</Link>
                <Link to="/shop" className="btn-shop-now-404">Browse Curtains →</Link>
            </div>
        </div>
    </div>
);

export default NotFound;
