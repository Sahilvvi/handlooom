import React, { useState, useEffect } from 'react';
import './LatestDesigns.css';

const LatestDesigns = () => {
    const [activeTab, setActiveTab] = useState('All Curtains');
    const [products, setProducts] = useState([]);

    const tabs = ['All Curtains', 'Door Curtains', 'Window Curtains', 'Living Room Curtains', 'Bedroom Curtains', 'Office Curtains'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data.slice(0, 8)); // Just show 8 for the grid
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

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
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="designs-grid">
                    {products.slice(0, 4).map((product, index) => (
                        <div key={product._id} className="design-card">
                            <div className="design-img">
                                <img src={index % 2 === 0 ? '/d1.png' : '/d2.png'} alt={product.name} />
                                {product.isBestSeller && <span className="best-seller-tag">Best Seller</span>}
                            </div>
                            <div className="design-info">
                                <h3>{product.name}</h3>
                                <div className="price-row">
                                    <span className="current-price">₹{product.price}</span>
                                    <span className="old-price">₹{Math.round(product.price * 1.25)}</span>
                                    <span className="discount-tag">21% OFF</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestDesigns;
