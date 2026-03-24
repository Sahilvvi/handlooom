import React, { useState, useEffect } from 'react';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './HeroSlider.css';

const defaultSlides = [
    {
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070',
        title: 'Where Every Window Feels Like Heaven',
        subtitle: 'Experience the ultimate luxury with our handcrafted premium curtains.',
        label: 'The Signature Collection',
        cta: 'Shop Now'
    }
];

const HeroSlider = () => {
    const { settings, loading } = useHomeSettings();
    const [current, setCurrent] = useState(0);

    const slides = (settings?.heroSlides && settings.heroSlides.length > 0) ? settings.heroSlides : defaultSlides;

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    if (loading) return <div className="hero-skeleton"></div>;

    return (
        <section className="hero-slider">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === current ? 'active' : ''}`}
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${getImgUrl(slide.image)})` }}
                >
                    <div className="container">
                        <div className="slide-content">
                            <span className="slide-label">{slide.label}</span>
                            <h2 className="slide-title">{slide.title}</h2>
                            <p className="slide-subtitle">{slide.subtitle}</p>
                            <a href={slide.link || "/shop"} className="btn-primary">{slide.cta || 'Shop Now'}</a>
                        </div>
                    </div>
                </div>
            ))}
            {slides.length > 1 && (
                <div className="slider-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === current ? 'active' : ''}`}
                            onClick={() => setCurrent(index)}
                        ></button>
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSlider;
