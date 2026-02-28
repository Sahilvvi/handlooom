import React from 'react';
import { Link } from 'react-router-dom';
import './MaterialGrid.css';

const materials = [
    { title: 'Cotton Curtains', offer: 'UPTO 40% OFF', image: '/h1.png', search: 'cotton' },
    { title: 'Velvet Curtains', offer: 'UPTO 34% OFF', image: '/h2.png', search: 'Velvet' },
    { title: 'Polyester Curtains', offer: 'UPTO 45% OFF', image: '/h1.png', search: 'polyester' },
    { title: 'Net Curtains', offer: 'UPTO 24% OFF', image: '/h2.png', search: 'Sheer' }
];

const MaterialGrid = () => {
    return (
        <section className="material-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Shop Curtains By Material</h2>
                    <p>Find the Perfect Fabric — From Sheers to Blackouts</p>
                </div>
                <div className="material-grid">
                    {materials.map((item, index) => (
                        <Link key={index} to={`/shop?search=${encodeURIComponent(item.search)}`} className="material-card">
                            <div className="material-img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="material-info">
                                <h3>{item.title}</h3>
                                <p className="offer-badge">{item.offer}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MaterialGrid;
