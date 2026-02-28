import React from 'react';
import './MaterialGrid.css';

const materials = [
    { title: 'Cotton Curtains', offer: 'UPTO 40% OFF', image: '/h1.png' },
    { title: 'Velvet Curtains', offer: 'UPTO 34% OFF', image: '/h2.png' },
    { title: 'Polyester Curtains', offer: 'UPTO 45% OFF', image: '/h1.png' },
    { title: 'Net Curtains', offer: 'UPTO 24% OFF', image: '/h2.png' }
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
                        <div key={index} className="material-card">
                            <div className="material-img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="material-info">
                                <h3>{item.title}</h3>
                                <p className="from-price">From ₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MaterialGrid;
