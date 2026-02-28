import React from 'react';
import './BudgetFriendly.css';

const collections = [
    { title: 'Door Curtains', price: '476', image: '/f1.png' },
    { title: 'Window Curtains', price: '391', image: '/f2.png' },
    { title: 'Kids Room Curtains', price: '999', image: '/f1.png' },
    { title: 'Floral Curtains', price: '391', image: '/f2.png' }
];

const BudgetFriendly = () => {
    return (
        <section className="budget-section">
            <div className="container">
                <div className="section-header-alt">
                    <h2>Budget-Friendly Curtains Additions</h2>
                    <p>Find Premium Quality Products At Affordable Prices</p>
                </div>
                <div className="budget-grid">
                    {collections.map((item, index) => (
                        <div key={index} className="budget-card">
                            <div className="budget-img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="budget-info">
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

export default BudgetFriendly;
