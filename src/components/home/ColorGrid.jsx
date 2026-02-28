import React from 'react';
import './ColorGrid.css';

const colors = [
    { title: 'White Curtains', offer: 'UPTO 39% OFF', image: '/q1.png' },
    { title: 'Blue Curtains', offer: 'UPTO 30% OFF', image: '/q2.png' },
    { title: 'Green Curtains', offer: 'UPTO 30% OFF', image: '/q3.png' },
    { title: 'Grey Curtains', offer: 'UPTO 42% OFF', image: '/q1.png' },
    { title: 'Black Curtains', offer: 'UPTO 43% OFF', image: '/q2.png' }
];

const ColorGrid = () => {
    return (
        <section className="color-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Explore Curtains by Color</h2>
                    <p>Color Your Space with Style & Elegance</p>
                </div>
                <div className="color-grid">
                    {colors.map((item, index) => (
                        <div key={index} className="color-card">
                            <div className="color-img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="color-info">
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

export default ColorGrid;
