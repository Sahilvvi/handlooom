import React from 'react';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/api';
import useHomeSettings from '../../hooks/useHomeSettings';
import './MaterialGrid.css';

const MaterialGrid = () => {
    const { settings, loading } = useHomeSettings();

    if (loading) return null;

    const items = settings?.materials || [];

    if (items.length === 0) return null;

    return (
        <section className="material-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Shop Curtains By Material</h2>
                    <p>Find the Perfect Fabric — From Sheers to Blackouts</p>
                </div>
                <div className="material-grid">
                    {items.map((item, index) => (
                        <Link key={index} to={item.link || `/shop?search=${encodeURIComponent(item.name)}`} className="material-card">
                            <div className="material-img">
                                <img src={getImgUrl(item.image)} alt={item.name} onError={(e) => e.target.src = 'https://via.placeholder.com/300x400'} />
                            </div>
                            <div className="material-info">
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

export default MaterialGrid;
