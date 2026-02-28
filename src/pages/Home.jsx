import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductCard from '../components/product/ProductCard';
import './Home.css';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setBestSellers(data.filter(p => p.isBestSeller).slice(0, 8));
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchBestSellers();
    }, []);

    return (
        <main className="home-page">
            <HeroSlider />

            <CategoryGrid />

            <section className="best-sellers-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Best Sellers</h2>
                        <p className="section-subtitle">Our most-loved handloom creations for your home.</p>
                    </div>
                    <div className="product-grid">
                        {bestSellers.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="view-all-container">
                        <a href="/shop" className="btn-outline">View All Products</a>
                    </div>
                </div>
            </section>

            <section className="shop-by-room">
                <div className="container">
                    <h2 className="section-title">Shop by Room</h2>
                    <div className="room-grid">
                        {[
                            { name: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000' },
                            { name: 'Living Room', image: 'https://images.unsplash.com/photo-1616489953149-6058e5797800?q=80&w=1000' },
                            { name: 'Kids Room', image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1000' },
                            { name: 'Dining Area', image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000' }
                        ].map((room, i) => (
                            <div key={i} className="room-card">
                                <img src={room.image} alt={room.name} />
                                <div className="room-overlay">
                                    <h3>{room.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container features-grid">
                    <div className="feature-item">
                        <div className="feature-icon">🌿</div>
                        <h4>Premium Fabric</h4>
                        <p>Sourced from the finest handloom weavers across India.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">✨</div>
                        <h4>Unique Designs</h4>
                        <p>Exclusive patterns that blend tradition with modern aesthetics.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">💎</div>
                        <h4>Affordable Luxury</h4>
                        <p>Premium quality home décor that doesn't break the bank.</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🚚</div>
                        <h4>Fast Delivery</h4>
                        <p>Secure packaging and quick shipping across India.</p>
                    </div>
                </div>
            </section>

            <section className="instagram-section">
                <div className="container">
                    <h2 className="section-title">#JannatHome</h2>
                    <p className="text-center">Tag us to get featured in our gallery</p>
                    <div className="insta-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="insta-item">
                                <img src={`https://images.unsplash.com/photo-${1513519245088 + i * 1000}-0e12902e5a38?q=80&w=400&h=400&fit=crop`} alt="Insta Post" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
