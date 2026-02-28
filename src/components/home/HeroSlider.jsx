import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1615873968403-89e068629275?q=80&w=2070',
        title: 'Transform Your Home Into Jannat',
        subtitle: 'Premium Handloom Curtains Crafted with Love',
        cta: 'Shop Now'
    },
    {
        image: 'https://images.unsplash.com/photo-1541004995602-b3e89b7899a2?q=80&w=2070',
        title: 'Light. Airy. Elegant.',
        subtitle: 'Sheer Curtains That Breathe Luxury',
        cta: 'Explore Collection'
    },
    {
        image: 'https://images.unsplash.com/photo-1505691722718-4684375e7970?q=80&w=2070',
        title: 'Tradition Meets Modern Living',
        subtitle: 'Timeless Handloom Designs',
        cta: 'View Designs'
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
                            <span className="slide-label">Luxury Collection</span>
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
