import React from 'react';
import { Link } from 'react-router-dom';
import './ColorGrid.css';

const colors = [
    { title: 'White Curtains', offer: 'UPTO 39% OFF', image: '/q1.png', search: 'white' },
    { title: 'Blue Curtains', offer: 'UPTO 30% OFF', image: '/q2.png', search: 'blue' },
    { title: 'Green Curtains', offer: 'UPTO 30% OFF', image: '/q3.png', search: 'green' },
    { title: 'Grey Curtains', offer: 'UPTO 42% OFF', image: '/q1.png', search: 'grey' },
    { title: 'Black Curtains', offer: 'UPTO 43% OFF', image: '/q2.png', search: 'black' }
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
                        <Link key={index} to={`/shop?search=${encodeURIComponent(item.search)}`} className="color-card">
                            <div className="color-img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="color-info">
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

export default ColorGrid;
