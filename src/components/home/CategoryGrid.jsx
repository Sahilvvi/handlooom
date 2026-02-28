import React from 'react';
import './CategoryGrid.css';

const categories = [
    {
        title: 'Luxe Blackout',
        subtitle: '100% Light Block | Premium Velvet',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070',
        link: '/shop/blackout'
    },
    {
        title: 'Etherial Sheers',
        subtitle: 'Soft Light | Delicate Linen',
        image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2070',
        link: '/shop/sheer'
    },
    {
        title: 'Royal Jacquard',
        subtitle: 'Intricate Weaves | Timeless Style',
        image: 'https://images.unsplash.com/photo-1620626011761-9963d7521576?q=80&w=2070',
        link: '/shop/jacquard'
    },
    {
        title: 'Modern Prints',
        subtitle: 'Vibrant Patterns | Contemporary Touch',
        image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=2070',
        link: '/shop/printed'
    },
    {
        title: 'Pure Linen',
        subtitle: 'Natural Texture | Breathable Elegance',
        image: 'https://images.unsplash.com/photo-1505671811271-85573489fe1b?q=80&w=2070',
        link: '/shop/linen'
    },
    {
        title: 'Vintage Velvet',
        subtitle: 'Plush Comfort | Sophisticated Warmth',
        image: 'https://images.unsplash.com/photo-1616489953149-6058e5797800?q=80&w=2070',
        link: '/shop/velvet'
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
                            <div className="category-info">
                                <h3>{cat.title}</h3>
                                <p>{cat.subtitle}</p>
                                <span className="shop-link">Explore Collection →</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
