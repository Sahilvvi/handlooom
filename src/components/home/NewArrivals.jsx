import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './NewArrivals.css';

// Actual photos only

const NewArrivals = ({ products = [], loading = false }) => {
    // Get 6 most recent arrivals
    const arrivals = [...products]
        .filter(p => p.isActive !== false && p.images?.length > 0)
        .reverse()
        .slice(0, 6);

    if (loading && arrivals.length === 0) return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <div className="skeleton-loader-bar"></div>
        </div>
    );

    if (arrivals.length === 0) return null;

    return (
        <section className="new-arrivals-premium">
            <div className="container">
                <div className="arrivals-layout">
                    <div className="arrivals-info-box">
                        <span className="accent-tag">Just In</span>
                        <h2>The New Season</h2>
                        <p>Discover fresh textures and artisan patterns designed for the contemporary home sanctuary.</p>
                        <Link to="/shop" className="text-cta">
                            <span>Explore Newest Designs</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </Link>
                    </div>

                    <div className="arrivals-grid">
                        {arrivals.map((product) => {
                            const imgUrl = getImgUrl(product.images[0]);

                            return (
                                <Link key={product._id} to={`/product/${product._id}`} className="arrival-item-card">
                                    <div className="arrival-img-box">
                                        <img src={imgUrl} alt={product.name} loading="lazy" />
                                        <div className="arrival-status">New</div>
                                    </div>
                                    <div className="arrival-details">
                                        <h4>{product.name}</h4>
                                        <div className="arrival-pricing">
                                            <span className="price-tag">₹{product.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};


export default NewArrivals;
