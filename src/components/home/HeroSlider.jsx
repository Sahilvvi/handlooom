import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070',
        title: 'Where Every Window Feels Like Heaven',
        subtitle: 'Experience the ultimate luxury with our handcrafted premium curtains.',
        label: 'The Signature Collection',
        cta: 'Shop Now'
    },
    {
        image: 'https://images.unsplash.com/photo-1541004995602-b3e89b7899a2?q=80&w=2070',
        title: 'Elegance in Every Fold',
        subtitle: 'Transform your living spaces with textures that breathe sophisticated warmth.',
        label: 'Pure Linen & Sheers',
        cta: 'Explore More'
    },
    {
        image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2070',
        title: 'Timeless Artistry for Modern Homes',
        subtitle: 'A harmonious blend of traditional handloom weaves and contemporary design.',
        label: 'Luxe Jacquards',
        cta: 'View Collection'
    }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-slider">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === current ? 'active' : ''}`}
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image})` }}
                >
                    <div className="container">
                        <div className="slide-content">
                            <span className="slide-label">{slide.label}</span>
                            <h2 className="slide-title">{slide.title}</h2>
                            <p className="slide-subtitle">{slide.subtitle}</p>
                            <a href="/shop" className="btn-primary">{slide.cta}</a>
                        </div>
                    </div>
                </div>
            ))}
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === current ? 'active' : ''}`}
                        onClick={() => setCurrent(index)}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;
