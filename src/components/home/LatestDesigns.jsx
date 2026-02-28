import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LatestDesigns.css';

const allLocalImages = ['/d1.png', '/d2.png', '/s1.png', '/s2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png'];

const getImg = (seed = '', offset = 0) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % allLocalImages.length;
    return allLocalImages[(hash + offset) % allLocalImages.length];
};

const LatestDesigns = () => {
    const [activeTab, setActiveTab] = useState('All Curtains');
    const [products, setProducts] = useState([]);

    const tabs = ['All Curtains', 'Door Curtains', 'Window Curtains', 'Living Room Curtains', 'Bedroom Curtains', 'Office Curtains'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data.slice(0, 8));
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <section className="latest-designs-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Latest Curtain Designs - 2026</h2>
                    <p>Design Your Home Decor, Your Way</p>
                </div>

                <div className="design-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="designs-grid">
                    {products.slice(0, 4).map((product, index) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="design-card">
                            <div className="design-img">
                                <img src={getImg(product._id || product.name, index)} alt={product.name} />
                                {product.isBestSeller && <span className="best-seller-tag">Best Seller</span>}
                            </div>
                            <div className="design-info">
                                <h3>{product.name}</h3>
                                <div className="price-row">
                                    <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
                                    <span className="old-price">₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}</span>
                                    <span className="discount-tag">21% OFF</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Link to="/shop" className="view-all-btn">View All Products →</Link>
                </div>
            </div>
        </section>
    );
};

export default LatestDesigns;
