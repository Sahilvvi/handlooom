import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './LatestDesigns.css';

// Product listing with actual database images only

const LatestDesigns = ({ products = [], loading = false }) => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Living Room', 'Bedroom', 'Sheer', 'Blackout', 'Velvet'];

    // Filter products based on active tab
    const filteredProducts = products.filter(p => {
        if (p.isActive === false || !p.images || p.images.length === 0) return false;
        if (activeTab === 'All') return true;
        
        const room = p.room?.toLowerCase() || '';
        const cat = p.category?.toLowerCase() || '';
        const search = activeTab.toLowerCase();
        
        return room.includes(search) || cat.includes(search);
    }).slice(0, 8);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <section className="latest-designs-premium">
            <div className="container">
                <div className="section-head-premium">
                    <span className="sub-tag">Luxury Collection</span>
                    <h2>Elevate Your Space</h2>
                    <p>Discover our most sought-after designs curated for modern homes</p>
                </div>

                <div className="design-filters">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="designs-grid-premium">
                    {loading && filteredProducts.length === 0 ? (
                        <div className="loading-placeholder">
                           {[1,2,3,4].map(i => <div key={i} className="skeleton-card"></div>)}
                        </div>
                    ) : (
                        filteredProducts.map((product, index) => {
                            const imgUrl = getImgUrl(product.images[0]);

                            return (
                                <Link key={product._id} to={`/product/${product._id}`} className="premium-design-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="card-img-box">
                                        <img src={imgUrl} alt={product.name} loading="lazy" />
                                        <div className="card-badge-gold">{product.category}</div>
                                        <div className="card-hover-overlay">
                                            <span className="view-details">Quick Look</span>
                                        </div>
                                    </div>
                                    <div className="card-details">
                                        <div className="card-meta">
                                            <span>{product.material || 'Premium Fabric'}</span>
                                            <span className="dot">•</span>
                                            <span>{product.room || 'All Rooms'}</span>
                                        </div>
                                        <h3>{product.name}</h3>
                                        <div className="card-pricing">
                                            <span className="price-new">₹{product.price}</span>
                                            {product.originalPrice > product.price && (
                                                <span className="price-old">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>

                <div className="section-footer-btns">
                    <Link to="/shop" className="outline-premium-btn">
                        <span>View Entire Collection</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};


export default LatestDesigns;
