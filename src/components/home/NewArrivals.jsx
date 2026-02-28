import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewArrivals.css';

const allLocalImages = ['/d1.png', '/d2.png', '/g1.png', '/g2.png', '/h1.png', '/h2.png', '/q1.png', '/q2.png'];

const getImg = (seed = '', offset = 0) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % allLocalImages.length;
    return allLocalImages[(hash + offset) % allLocalImages.length];
};

const NewArrivals = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(r => r.json())
            .then(data => {
                // Show the 2 most recently added products (last in array)
                const sorted = Array.isArray(data) ? [...data].reverse() : [];
                setProducts(sorted.slice(0, 2));
            })
            .catch(() => { });
    }, []);

    return (
        <section className="new-arrivals-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>New Arrivals</h2>
                    <p>We Love New Things, Don't You?</p>
                </div>
                <div className="arrivals-grid">
                    {products.length > 0 ? products.map((product, index) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="arrival-card">
                            <div className="arrival-img">
                                <img src={getImg(product._id || product.name, index)} alt={product.name} />
                                {product.isBestSeller && <span className="new-tag">Best Seller</span>}
                                {!product.isBestSeller && <span className="new-tag">New</span>}
                            </div>
                            <div className="arrival-info">
                                <h3>{product.name}</h3>
                                <div className="price-row">
                                    <span className="current-price">₹ {product.price?.toLocaleString('en-IN')}</span>
                                    <span className="old-price">₹ {Math.round(product.price * 1.27).toLocaleString('en-IN')}</span>
                                    <span className="discount-tag">21% OFF</span>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        // Skeleton fallback while loading
                        [0, 1].map(i => (
                            <div key={i} className="arrival-card skeleton-card">
                                <div className="skeleton-img"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        ))
                    )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Link to="/shop" className="view-all-btn">View All New Arrivals →</Link>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
