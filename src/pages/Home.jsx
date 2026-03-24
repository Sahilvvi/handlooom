import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/category/CategoryGrid';
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
                const res = await fetch(`${BASE_URL}/api/products?limit=24`);
                const data = await res.json();
                if (data && data.products) setProducts(data.products);
                else if (Array.isArray(data)) setProducts(data);
            } catch (err) {
                console.error("Home fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Global Scroll Observer for Animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });

        const targets = document.querySelectorAll('[data-animate]');
        targets.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [loading]);

    return (
        <main className="home-main-premium">
            {/* 1. Cinematic Hero Section */}
            <HeroSlider />

            {/* 2. Shop by Category - Minimal Grid */}
            <div className="section-padding" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>Curated Collections</h2>
                        <p>Explore our handcrafted drapes by style and technique</p>
                    </div>
                    <CategoryGrid />
                </div>
            </div>

            {/* 3. Trending Now Strip */}
            <div data-animate>
               <BestSellers products={products} loading={loading} />
            </div>

            {/* 4. Shop by Room - Lifestyle Integration */}
            <div className="section-padding bg-alt" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>Shop by Sanctuary</h2>
                        <p>Artisanal solutions tailored for every space in your home</p>
                    </div>
                    <RoomTypeGrid />
                </div>
            </div>

            {/* 5. Promotional Call-to-Action */}
            <div data-animate>
                <WidePromoBanner />
            </div>

            {/* 6. New Masterpieces */}
            <div className="section-padding" data-animate>
                <NewArrivals products={products} loading={loading} />
            </div>

            {/* 7. Artisanal Materials Showcase */}
            <div className="section-padding bg-alt" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>The Art of Texture</h2>
                        <p>Finest fabrics sourced for durability and aesthetic light-play</p>
                    </div>
                    <MaterialGrid />
                </div>
            </div>

            {/* 8. Palette Philosophy */}
            <div className="section-padding" data-animate>
                <div className="container">
                    <div className="section-header">
                        <h2>Palette of light</h2>
                        <p>Find the perfect hue to complement your interior's soul</p>
                    </div>
                    <ColorGrid />
                </div>
            </div>

            {/* 9. Experience Invitation */}
            <section className="experience-invite section-padding" data-animate>
                <div className="container">
                    <div className="invite-card glass">
                        <div className="invite-content">
                            <span className="accent-tag">The Boutique Experience</span>
                            <h2>Visit Our Delhi Gallery</h2>
                            <p>Witness the dance of light through our hand-woven fabrics in person. Our styling concierge is waiting to assist you in Rajouri Garden.</p>
                            <div className="invite-cta">
                                <Link to="/about" className="btn-primary">Our Stores</Link>
                                <Link to="/contact" className="btn-secondary">Book Consultation</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
