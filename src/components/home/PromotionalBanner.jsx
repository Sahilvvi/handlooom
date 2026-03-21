import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './PromotionalBanner.css';

const PromotionalBanner = ({ products = [] }) => {
    const INITIAL_BANNERS = [
        {
            _id: 'default1',
            image: '/home/heritage.png',
            title: 'Jannat Handloom',
            subtitle: 'Artisanal Excellence Since 1998',
            link: '/shop',
            buttonText: 'Explore Now'
        }
    ];

    const [banners, setBanners] = useState(INITIAL_BANNERS);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false); // Start false since we have a default

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/banners`);
                const data = await response.json();
                
                if (Array.isArray(data) && data.length > 0) {
                    setBanners(data);
                } else if (products && products.length > 0) {
                    // Update fallback if products are available
                    const top = products.filter(p => (p.isBestSeller || p.price > 1500) && p.images?.length > 0).slice(0, 3);
                    if (top.length > 0) {
                        const derived = top.map(p => ({
                            _id: p._id,
                            image: p.images[0],
                            title: p.name,
                            subtitle: `Premium ${p.category} Collection`,
                            link: `/product/${p._id}`,
                            buttonText: 'View Product'
                        }));
                        setBanners(derived);
                    }
                }
                // If API is empty and no products yet, we keep INITIAL_BANNERS
            } catch (err) {
                console.error("Failed to fetch banners:", err);
            }
        };
        fetchBanners();
    }, []); // Run only once on mount


    // Auto-slide if multiple banners exist
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (loading) return <div className="banner-skeleton" style={{ height: '500px', background: '#f0f0f0' }}></div>;

    if (banners.length === 0) return null;


    return (
        <section className="promotional-banner">
            <div className="banner-slider">
                {banners.map((banner, index) => (
                    <div 
                        key={banner._id} 
                        className={`banner-slide ${index === current ? 'active' : ''}`}
                    >
                        <div className="container banner-container">
                            <div className="banner-inner">
                                <div className="banner-info">
                                    <div className="banner-tag animate-up">Premium Collection</div>
                                    {banner.title && <h2 className="banner-title animate-up delay-1">{banner.title}</h2>}
                                    {banner.subtitle && <p className="banner-subtitle animate-up delay-2">{banner.subtitle}</p>}
                                    <div className="banner-actions animate-up delay-3">
                                        <Link to={banner.link || '/shop'} className="banner-cta premium-btn">
                                            <span>Explore Now</span>
                                            <div className="btn-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="banner-visual animate-fade-in">
                                    <div className="img-wrapper">
                                        <div className="floating-card">
                                            <img 
                                                src={getImgUrl(banner.image)} 
                                                alt={banner.title || "Promotional Banner"} 
                                                className="hero-img" 
                                            />
                                            <div className="img-accent"></div>
                                        </div>
                                        <div className="img-backdrop-decorative"></div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                ))}
            </div>
            {banners.length > 1 && (
                <div className="banner-nav">
                    <div className="container">
                        <div className="nav-controls">
                            {banners.map((_, i) => (
                                <button 
                                    key={i} 
                                    className={`nav-dot ${i === current ? 'active' : ''}`} 
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};


export default PromotionalBanner;

