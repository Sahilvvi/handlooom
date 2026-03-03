import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('jannat_wishlist') || '[]');
        if (!ids.length) { setLoading(false); return; }

        // Fetch all products and filter by wishlisted IDs
        fetch('http://localhost:5000/api/products')
            .then(r => r.json())
            .then(data => {
                setProducts(data.filter(p => ids.includes(p._id)));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const removeFromWishlist = (id) => {
        const wishlist = JSON.parse(localStorage.getItem('jannat_wishlist') || '[]');
        const updated = wishlist.filter(i => i !== id);
        localStorage.setItem('jannat_wishlist', JSON.stringify(updated));
        setProducts(prev => prev.filter(p => p._id !== id));
    };

    if (loading) return <div className="wishlist-empty"><p>Loading...</p></div>;

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="wishlist-header">
                    <h1>My Wishlist ❤️</h1>
                    <p className="wishlist-count">{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
                </div>

                {products.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="empty-icon">🤍</div>
                        <h3>Your wishlist is empty</h3>
                        <p>Save items you love by clicking the ❤️ on any product card</p>
                        <Link to="/shop" className="btn-shop-now">Browse Curtains →</Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {products.map(product => {
                            const img = product.images?.[0] || '/s1.png';
                            const discount = product.originalPrice > product.price
                                ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
                            return (
                                <div key={product._id} className="wishlist-card">
                                    <button className="remove-wish" onClick={() => removeFromWishlist(product._id)} title="Remove from wishlist">✕</button>
                                    <Link to={`/product/${product._id}`}>
                                        <div className="wish-img-wrap">
                                            <img src={img} alt={product.name} onError={e => { e.target.src = '/s1.png'; }} />
                                        </div>
                                        <div className="wish-info">
                                            <span className="wish-cat">{product.category}</span>
                                            <h3>{product.name}</h3>
                                            <div className="wish-price">
                                                <span className="wish-current">₹{product.price?.toLocaleString('en-IN')}</span>
                                                {discount && <span className="wish-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>}
                                                {discount && <span className="wish-discount">-{discount}%</span>}
                                            </div>
                                        </div>
                                    </Link>
                                    <button className="btn-add-wish" onClick={() => {
                                        const cart = JSON.parse(localStorage.getItem('jannat_cart') || '[]');
                                        const ex = cart.find(i => i._id === product._id);
                                        if (ex) ex.quantity += 1;
                                        else cart.push({ ...product, quantity: 1 });
                                        localStorage.setItem('jannat_cart', JSON.stringify(cart));
                                        window.dispatchEvent(new Event('storage'));
                                        alert(`✅ ${product.name} added to cart!`);
                                    }}>Add to Cart</button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
