import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PromotionalBanner from '../components/home/PromotionalBanner';
import QuickLinks from '../components/home/QuickLinks';
import LatestDesigns from '../components/home/LatestDesigns';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
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
                if (data && data.products) {
                    setProducts(data.products);
                } else if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (err) {
                console.error("Home fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Scroll Reveal Logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [loading]);

    return (
        <main className="home-page-premium">
            {/* 1. Hero Banner */}
            <PromotionalBanner products={products} />
            
            {/* 2. Categories */}
            <div className="reveal-on-scroll">
                <QuickLinks products={products} loading={loading} />
            </div>

            {/* 3. Best Sellers Scroll Strip */}
            <div className="reveal-on-scroll">
                <BestSellers products={products} loading={loading} />
            </div>

            {/* 4. Featured Designs */}
            <div className="reveal-on-scroll">
                <LatestDesigns products={products} loading={loading} />
            </div>

            {/* NEW SECTION: Artisanal Excellence */}
            <section className="artisanal-section reveal-on-scroll">
                <div className="container">
                    <div className="artisanal-grid">
                        <div className="artisanal-image">
                            <img src="/home/heritage.png" alt="Artisanal Weaving" />
                            <div className="since-tag">EST. 2026</div>
                        </div>
                        <div className="artisanal-content">
                            <span className="accent-tag">Our Heritage</span>
                            <h2>Artisanal Excellence in Every Thread</h2>
                            <p>For decades, Jannat Handloom has been synonymous with luxury and craft. Every curtain we produce is a testament to our commitment to quality, woven with passion and precision.</p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <div className="f-icon">✨</div>
                                    <div>
                                        <h4>Hand-Curated Fabrics</h4>
                                        <p>Only the finest silks, linens, and velvets make it to our loom.</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="f-icon">🤝</div>
                                    <div>
                                        <h4>Direct to You</h4>
                                        <p>Eliminating middlemen to provide peak luxury at fair prices.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* 4. New Arrivals */}
            <div className="reveal-on-scroll">
                <NewArrivals products={products} loading={loading} />
            </div>

            {/* NEW SECTION: Experience the Texture (Fabric Showcase) */}
            <section className="texture-section reveal-on-scroll">
                <div className="container">
                    <div className="section-head-premium">
                        <span className="sub-tag">The Materials</span>
                        <h2>Experience the Texture</h2>
                    </div>
                    <div className="texture-grid">
                        <div className="texture-card">
                            <div className="t-img"><img src="/home/velvet.png" alt="Luxury Velvet" /></div>
                            <h3>Luxury Velvet</h3>
                            <p>Plush, deep, and light-absorbing for ultimate privacy and warmth.</p>
                        </div>
                        <div className="texture-card">
                            <div className="t-img"><img src="/home/linen.png" alt="Pure Linen" /></div>
                            <h3>Pure Linen</h3>
                            <p>Breathable and natural, perfect for creating airy, sunlit sanctuaries.</p>
                        </div>
                        <div className="texture-card">
                            <div className="t-img"><img src="/home/sheer.png" alt="Ethereal Sheer" /></div>
                            <h3>Ethereal Sheer</h3>
                            <p>Softly diffused light for a dreamlike atmosphere and elegant draping.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Newsletter - Integrated Design */}
            <section className="newsletter-section reveal-on-scroll">
                <div className="container">
                    <div className="newsletter-card-premium">
                        <div className="newsletter-visual">
                            <img src="/home/heritage.png" alt="Premium Fabric" className="newsletter-bg-img" />
                            <div className="newsletter-overlay"></div>
                        </div>
                        <div className="newsletter-content-alt">
                            <span className="newsletter-tag">Exclusive Access</span>
                            <h2>Join the Inner Circle</h2>
                            <p>Be the first to discover new collections, artisan stories, and exclusive styling invitations.</p>
                            <form className="newsletter-form-premium" onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Enter your email address" required />
                                <button type="submit">Experience Jannat</button>
                            </form>
                            <p className="privacy-note">By subscribing, you agree to our Privacy Policy and Terms of Excellence.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: Social & Contact Integration */}
            <section className="brand-connection reveal-on-scroll">
                <div className="container">
                    <div className="connection-grid">
                        <div className="connection-box">
                            <h4>Follow Our Journey</h4>
                            <div className="social-links-premium">
                                <a href="#" aria-label="Instagram"><span>Instagram</span></a>
                                <a href="#" aria-label="Pinterest"><span>Pinterest</span></a>
                                <a href="#" aria-label="Facebook"><span>Facebook</span></a>
                            </div>
                        </div>
                        <div className="connection-divider"></div>
                        <div className="connection-box">
                            <h4>Bespeak Assistance</h4>
                            <div className="contact-links-premium">
                                <a href="tel:+919999900000">+91 99999 00000</a>
                                <a href="mailto:concierge@jannatloom.com">concierge@jannatloom.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};


export default Home;

