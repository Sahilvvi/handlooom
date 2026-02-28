import React from 'react';
import './CategoryGrid.css';

const categories = [
    {
        title: 'Blackout Curtains',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070',
        link: '/shop/blackout'
    },
    {
        title: 'Sheer Curtains',
        image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2070',
        link: '/shop/sheer'
    },
    {
        title: 'Printed Curtains',
        image: 'https://images.unsplash.com/photo-1620626011761-9963d7521576?q=80&w=2070',
        link: '/shop/printed'
    },
    {
        title: 'Velvet Curtains',
        image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=2070',
        link: '/shop/velvet'
    },
    {
        title: 'Bedroom Curtains',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070',
        link: '/shop/bedroom'
    },
    {
        title: 'Living Room Curtains',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
        link: '/shop/living-room'
    }
];

const CategoryGrid = () => {
    return (
        <section className="category-section">
            <div className="container">
                <h2 className="section-title">Shop by Category</h2>
                <div className="category-grid">
                    {categories.map((cat, index) => (
                        <a href={cat.link} key={index} className="category-card">
                            <div className="category-image">
                                <img src={cat.image} alt={cat.title} />
                            </div>
                            <div className="category-overlay">
                                <h3>{cat.title}</h3>
                                <span className="shop-link">Explore</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
