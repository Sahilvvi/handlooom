import React from 'react';
import { Link } from 'react-router-dom';
import './QuickLinks.css';

const categories = [
    { title: 'Window Curtains', image: '/c1.png', path: '/shop/window' },
    { title: 'Door Curtains', image: '/c2.png', path: '/shop/door' },
    { title: 'Office Curtains', image: '/c1.png', path: '/shop/office' },
    { title: 'Blackout Curtains', image: '/c2.png', path: '/shop/blackout' },
    { title: 'Sheer Curtains', image: '/c1.png', path: '/shop/sheer' },
    { title: 'Living Room', image: '/c2.png', path: '/shop/living' },
    { title: 'Transparent', image: '/c1.png', path: '/shop/sheer' },
    { title: 'Kitchen', image: '/c2.png', path: '/shop/kitchen' },
    { title: 'Bedroom', image: '/c1.png', path: '/shop/bedroom' }
];

const QuickLinks = () => {
    return (
        <section className="quick-links">
            <div className="container">
                <div className="quick-links-scroll">
                    {categories.map((cat, index) => (
                        <Link key={index} to={cat.path} className="quick-link-item">
                            <div className="circle-img">
                                <img src={cat.image} alt={cat.title} />
                            </div>
                            <span>{cat.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickLinks;
