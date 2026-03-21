import React from 'react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/api';
import './BestSellers.css';

const BestSellers = ({ products = [], loading = false }) => {
    const sellers = products
        .filter(p => p.isActive !== false && p.images?.length > 0)
        .sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
        .slice(0, 10);

    return (
        <section className="bestsellers-section">
            <div className="container">
                <div className="bs-header">
                    <div className="bs-title-group">
                        <span className="bs-tag">🔥 Most Loved</span>
                        <h2>Best Selling Curtains</h2>
                        <p>Handpicked favourites from our customers</p>
                    </div>
                    <Link to="/shop" className="bs-view-all">View All →</Link>
                </div>

                <div className="bs-scroll-track">
                    {loading && sellers.length === 0
                        ? [...Array(5)].map((_, i) => (
                            <div key={i} className="bs-card-skeleton">
                                <div className="bs-sk-img shimmer" />
                                <div className="bs-sk-line shimmer" />
                                <div className="bs-sk-line short shimmer" />
                            </div>
                        ))
                        : sellers.map(product => (
                            <Link key={product._id} to={`/product/${product._id}`} className="bs-card">
                                <div className="bs-img-box">
                                    <img
                                        src={getImgUrl(product.images[0])}
                                        alt={product.name}
                                        loading="lazy"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/d1.png'; }}
                                    />
                                    {product.isBestSeller && (
                                        <span className="bs-badge">Best Seller</span>
                                    )}
                                    {product.originalPrice > product.price && (
                                        <span className="bs-discount-badge">
                                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className="bs-info">
                                    <p className="bs-cat">{product.category}</p>
                                    <h4 className="bs-name">{product.name}</h4>
                                    <div className="bs-price-row">
                                        <span className="bs-price">₹{product.price}</span>
                                        {product.originalPrice > product.price && (
                                            <span className="bs-old-price">₹{product.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
