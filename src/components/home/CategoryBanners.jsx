import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryBanners.css';

const CategoryBanners = () => {
    return (
        <section className="category-banners-section">
            <div className="container">
                <div className="category-banners-grid">
                    <Link to="/shop/window" className="cat-banner">
                        <img src="/c1.png" alt="Window Curtains Category" />
                    </Link>
                    <Link to="/shop/door" className="cat-banner">
                        <img src="/c2.png" alt="Door Curtains Category" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryBanners;
