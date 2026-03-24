import React from 'react';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './CategoryGrid.css';

const CategoryGrid = () => {
    const { settings, loading } = useHomeSettings();

    if (loading) return <div className="category-skeleton"></div>;

    const items = settings?.categories || [];

    if (items.length === 0) return null;

    return (
        <section className="category-section">
            <div className="container">
                <h2 className="section-title">Shop by Category</h2>
                <div className="category-grid">
                    {items.map((cat, index) => (
                        <a href={cat.link || '/shop'} key={index} className="category-card">
                            <div className="category-image">
                                <img src={getImgUrl(cat.image)} alt={cat.name} onError={(e) => e.target.src = 'https://via.placeholder.com/400x400'} />
                            </div>
                            <div className="category-info">
                                <h3>{cat.name}</h3>
                                {cat.subtitle && <p>{cat.subtitle}</p>}
                                <span className="shop-link">Explore Collection →</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
