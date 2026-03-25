import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import RoomTypeGrid from '../components/home/RoomTypeGrid';
import MaterialGrid from '../components/home/MaterialGrid';
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

        // Intersection Observer for Reveal elements
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const bestsellerProducts = products.filter(p => p.isBestSeller).slice(0, 8);
    const newArrivalProducts = products.slice(-8).reverse();

    return (
        <div className="home-premium">
            {/* 1. Cinematic Hero */}
            <HeroSlider />

            {/* 2. Artisanal Curated Collections */}
            <section className="section-premium ivory-bg reveal">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Signature Heritage</span>
                        <h2 className="title-luxury">Artisanal Curations</h2>
                        <div className="gold-divider"></div>
                        <p>Explore our masterfully crafted collections, where tradition meets contemporary elegance.</p>
                    </div>
                    <CategoryGrid />
                </div>
            </section>

            {/* 3. Room-Specific Specialization */}
            <section className="section-premium reveal">
                <div className="container">
                    <div className="section-header-left">
                        <span className="subtitle">Ambiance Tailored</span>
                        <h2 className="title-luxury">Design by Space</h2>
                        <p>Discover the ideal drape for every corner of your sanctuary, from serene bedrooms to grand living areas.</p>
                    </div>
                    <RoomTypeGrid />
                </div>
            </section>

            {/* 4. Materiality & Feel */}
            <section className="section-premium sage-bg-light reveal">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Tactiles & Textiles</span>
                        <h2 className="title-luxury">The Silk Road Palette</h2>
                        <div className="gold-divider"></div>
                        <p>Feel the excellence of our curated fabrics, from whisper-light sheers to majestic velvet blackouts.</p>
                    </div>
                    <MaterialGrid />
                </div>
            </section>
            
            {/* 5. Parallax Wide Promo */}
            <WidePromoBanner />

            {/* 6. Curated Showcases */}
            <section className="section-premium reveal">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Member Favorites</span>
                        <h2 className="title-luxury">Bestselling Masterpieces</h2>
                    </div>
                    <BestSellers products={bestsellerProducts} loading={loading} />
                </div>
            </section>

            <section className="section-premium ivory-bg reveal">
                <div className="container">
                    <div className="section-header-centered">
                        <span className="subtitle">Just Arrived</span>
                        <h2 className="title-luxury">The Fresh Edit</h2>
                    </div>
                    <NewArrivals products={newArrivalProducts} loading={loading} />
                </div>
            </section>

            {/* 7. Final Boutique CTA */}
            <section className="cta-luxury-section reveal">
                <div className="cta-bg-overlay"></div>
                <div className="container cta-content">
                    <span className="subtitle" style={{ color: 'var(--lux-gold)' }}>Exclusive Consultation</span>
                    <h3>Experience Artisanal Mastery</h3>
                    <p>Each Jannat drape is a symphony of luxury, hand-crafted specifically for the discerning eye.</p>
                    <div className="cta-buttons">
                        <Link to="/shop" className="btn-lux">Explore the Boutique</Link>
                        <Link to="/contact" className="btn-lux-outline" style={{ color: '#fff', borderColor: '#fff' }}>Private Consultation</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
