import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import RoomTypeGrid from '../components/home/RoomTypeGrid';
import MaterialGrid from '../components/home/MaterialGrid';
import ColorGrid from '../components/home/ColorGrid';
import WidePromoBanner from '../components/home/WidePromoBanner';
import BestSellers from '../components/home/BestSellers';
import NewArrivals from '../components/home/NewArrivals';
import BASE_URL from '../utils/api';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products`);
                const data = await res.json();
                if (res.ok) setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        window.scrollTo(0, 0);
    }, []);

    const bestsellerProducts = products.filter(p => p.isBestSeller).slice(0, 8);
    const newArrivalProducts = products.slice(-8).reverse();

    return (
        <div className="home-premium">
            {/* 1. Immersive Hero */}
            <HeroSlider />

            {/* 2. Artisanal Categories */}
            <section className="section-premium ivory-bg">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Heritage Craftsmanship</span>
                        <h2 className="title-luxury">Curated Collections</h2>
                        <div className="gold-divider"></div>
                    </div>
                    <CategoryGrid />
                </div>
            </section>

            {/* 3. Room Specialization */}
            <section className="section-premium white-bg">
                <div className="container">
                    <div className="section-header-left">
                        <span className="subtitle">Ambiance Defined</span>
                        <h2 className="title-luxury">Drapes for Every Space</h2>
                    </div>
                    <RoomTypeGrid />
                </div>
            </section>

            {/* 4. Materiality Focus */}
            <section className="section-premium sage-bg-light">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Tactile Excellence</span>
                        <h2 className="title-luxury">The Artisanal Palette</h2>
                    </div>
                    <MaterialGrid />
                </div>
            </section>
            
            {/* 5. Wide Promo Engagement */}
            <WidePromoBanner />

            {/* 6. High-Performance Showcases */}
            <section className="section-premium white-bg">
                <div className="container">
                    <BestSellers products={bestsellerProducts} loading={loading} />
                </div>
            </section>

            <section className="section-premium ivory-bg">
                <div className="container">
                    <NewArrivals products={newArrivalProducts} loading={loading} />
                </div>
            </section>

            {/* 7. Color Psychology */}
            <section className="section-premium white-bg">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Chromatic Harmony</span>
                        <h2 className="title-luxury">Discover by Vibration</h2>
                    </div>
                    <ColorGrid />
                </div>
            </section>

            {/* 8. Call to Action High-Fidelity */}
            <section className="cta-luxury-section">
                <div className="cta-bg-overlay"></div>
                <div className="container cta-content">
                    <h3>Experience Artisanal Mastery</h3>
                    <p>Each drape is a symphony of tradition and modern elegance, hand-crafted for the discerning home.</p>
                    <div className="cta-buttons">
                        <Link to="/shop" className="btn-luxury">Explore Boutique</Link>
                        <Link to="/contact" className="btn-luxury-outline">Private Consultation</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
