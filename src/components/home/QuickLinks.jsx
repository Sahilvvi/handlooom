import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './QuickLinks.css';

const QuickLinks = ({ products = [], loading = false }) => {
    const [categories, setCategories] = useState([]);

    const defaultCategories = [
        { title: 'Jacquard', image: getImgUrl('/home/jacquard.png'), path: '/shop/jacquard' },
        { title: 'Sheer', image: getImgUrl('/home/sheer.png'), path: '/shop/sheer' },
        { title: 'Velvet', image: getImgUrl('/home/velvet.png'), path: '/shop/velvet' },
        { title: 'Blackout', image: getImgUrl('/home/blackout.png'), path: '/shop/blackout' }
    ];

    useEffect(() => {
        if (!Array.isArray(products) || products.length === 0) {
            setCategories(defaultCategories);
            return;
        }
        
        // Derive unique categories with an example image
        const catMap = {};
        products.forEach(p => {
            if (p.category && p.images?.length > 0 && !catMap[p.category]) {
                catMap[p.category] = p.images[0];
            }
        });

        const derived = Object.keys(catMap).map(name => ({
            title: name,
            image: getImgUrl(catMap[name]),
            path: `/shop/${name.toLowerCase()}`
        }));

        setCategories(derived.length > 0 ? derived : defaultCategories);
    }, [products]);

    if (loading && categories.length === 0) return (
        <div className="container" style={{ display: 'flex', gap: '20px', padding: '40px 0', overflowX: 'auto' }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ minWidth: '100px', height: '100px', borderRadius: '50%', background: '#eee', flexShrink: 0 }}></div>)}
        </div>
    );
    if (categories.length === 0) return null;

    return (
        <section className="quick-links-new">
            <div className="container">
                <div className="links-header">
                    <h3>Explore by Category</h3>
                </div>
                <div className="links-wrapper">
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={cat.path} className="link-item">
                            <div className="link-img-wrapper">
                                <img src={cat.image} alt={cat.title} />
                                <div className="link-overlay">
                                    <div className="view-btn">View</div>
                                </div>
                            </div>
                            <span className="link-title">{cat.title}</span>
                            <span className="link-count">Curated Collection</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default QuickLinks;

