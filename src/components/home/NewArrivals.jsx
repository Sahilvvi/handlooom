import React from 'react';
import './NewArrivals.css';

const arrivals = [
    { name: 'Barasingha 1 Piece Door Curtain (White, 7 Feet)', price: '989', oldPrice: '1,259', discount: '21% OFF', image: '/d1.png' },
    { name: 'Bird Nest 1 Piece Curtain (White, 7 Feet)', price: '989', oldPrice: '1,259', discount: '21% OFF', image: '/d2.png' }
];

const NewArrivals = () => {
    return (
        <section className="new-arrivals-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>New Arrivals</h2>
                    <p>We Love New Things,Don't You?</p>
                </div>
                <div className="arrivals-grid">
                    {arrivals.map((item, index) => (
                        <div key={index} className="arrival-card">
                            <div className="arrival-img">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="arrival-info">
                                <h3>{item.name}</h3>
                                <div className="price-row">
                                    <span className="current-price">₹ {item.price}</span>
                                    <span className="old-price">₹ {item.oldPrice}</span>
                                    <span className="discount-tag">{item.discount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
