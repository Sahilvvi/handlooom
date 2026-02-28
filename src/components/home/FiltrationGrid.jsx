import React from 'react';
import './FiltrationGrid.css';

const filters = [
    { title: 'Room Darkening Curtains', offer: 'UPTO 24% OFF', image: '/s1.png' },
    { title: 'Blackout Curtains', offer: 'UPTO 34% OFF', image: '/s2.png' },
    { title: 'Sheer Curtains', offer: 'UPTO 40% OFF', image: '/s1.png' },
    { title: 'Light Filtering Curtains', offer: 'UPTO 24% OFF', image: '/s2.png' }
];

const FiltrationGrid = () => {
    return (
        <section className="filtration-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Shop Curtains By Light Filteration</h2>
                    <p>Redefine your style</p>
                </div>
                <div className="filtration-grid">
                    {filters.map((item, index) => (
                        <div key={index} className="filtration-card">
                            <div className="filtration-img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="filtration-info">
                                <h3>{item.title}</h3>
                                <p className="offer-badge">{item.offer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FiltrationGrid;
