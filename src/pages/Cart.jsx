import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty container">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some beautiful curtains to get started!</p>
                <Link to="/shop" className="btn-shop-now">Shop Now</Link>
            </div>
        );
    }

    const shipping = cartTotal >= 999 ? 0 : 99;

    return (
        <div className="cart-page container">
            <h1>Shopping Cart <span>({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span></h1>

            <div className="cart-layout">
                <div className="cart-items-list">
                    {cartItems.map(item => {
                        const allLocalImages = ['/s1.png', '/s2.png', '/d1.png', '/d2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png', '/h1.png', '/h2.png', '/q1.png', '/q2.png', '/q3.png'];
                        let hash = 0;
                        const seed = item._id || item.name || '';
                        for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % allLocalImages.length;
                        const img = allLocalImages[hash % allLocalImages.length];

                        return (
                            <div key={item._id} className="cart-item">
                                <img src={img} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-category">{item.category}</p>
                                    <p className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="cart-item-qty">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <div className="cart-item-total">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </div>
                                <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>✕</button>
                            </div>
                        );
                    })}
                </div>

                <div className="cart-summary-box">
                    <h3>Order Summary</h3>
                    <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                    <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-ship">FREE</span> : `₹${shipping}`}</span></div>
                    {shipping > 0 && <p className="free-ship-hint">Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping</p>}
                    <div className="summary-row grand"><span>Total</span><span>₹{(cartTotal + shipping).toLocaleString('en-IN')}</span></div>
                    <button className="btn-checkout" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                    <Link to="/shop" className="btn-continue">← Continue Shopping</Link>
                    <button className="btn-clear-cart" onClick={clearCart}>Clear Cart</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
