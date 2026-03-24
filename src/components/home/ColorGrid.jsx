import React from 'react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './ColorGrid.css';

const ColorGrid = () => {
    const { settings, loading } = useHomeSettings();

    if (loading) return null;

    const items = settings?.colors || [];

    if (items.length === 0) return null;

    return (
        <section className="color-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Explore Curtains by Color</h2>
                    <p>Color Your Space with Style & Elegance</p>
                </div>
                <div className="color-grid">
                    {items.map((item, index) => (
                        <Link key={index} to={item.link || `/shop?search=${encodeURIComponent(item.name)}`} className="color-card">
                            <div className="color-img">
                                <img src={getImgUrl(item.image)} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/200x200'} />
                            </div>
                            <div className="color-info">
                                <h3>{item.name}</h3>
                                {item.offer && <p className="offer-badge">{item.offer}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ColorGrid;
