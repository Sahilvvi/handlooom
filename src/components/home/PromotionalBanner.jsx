import React from 'react';
import { Link } from 'react-router-dom';
import './PromotionalBanner.css';

const PromotionalBanner = () => {
    return (
        <section className="promotional-banner">
            <div className="full-width-banner">
                <Link to="/shop">
                    <img src="/banner.png" alt="Splash of Sale Banner" className="hero-banner-img" />
                </Link>
            </div>
        </section>
    );
};

export default PromotionalBanner;
