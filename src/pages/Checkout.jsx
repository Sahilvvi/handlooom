import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const allLocalImages = ['/s1.png', '/s2.png', '/d1.png', '/d2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png', '/h1.png', '/h2.png', '/q1.png', '/q2.png', '/q3.png'];
const getImg = (seed = '') => { let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % allLocalImages.length; return allLocalImages[h]; };

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        address: '', city: '', state: '', pincode: '', phone: '',
        paymentMode: 'COD'
    });

    const shipping = cartTotal >= 999 ? 0 : 99;
    const total = cartTotal + shipping;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) { setStep(2); return; }
        if (step === 2) {
            setSubmitting(true);
            try {
                const token = localStorage.getItem('jannat_token');
                const orderPayload = {
                    items: cartItems.map(item => ({
                        product: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    shippingAddress: {
                        firstName: formData.firstName, lastName: formData.lastName,
                        email: formData.email, phone: formData.phone,
                        address: formData.address, city: formData.city,
                        state: formData.state, pincode: formData.pincode
                    },
                    paymentMode: formData.paymentMode,
                    subtotal: cartTotal,
                    shippingCost: shipping,
                    totalAmount: total
                };
                const res = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify(orderPayload)
                });
                const data = await res.json();
                if (res.ok) {
                    setOrderNumber(data.orderNumber);
                    clearCart();
                    setStep(3);
                }
            } catch (err) { console.error(err); }
            setSubmitting(false);
        }
    };

    if (cartItems.length === 0 && step < 3) {
        return (
            <div className="cart-empty container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '50vh' }}>
                <div style={{ fontSize: '3rem' }}>🛒</div>
                <h2>Your cart is empty</h2>
                <Link to="/shop" style={{ color: '#ed6c0d', fontWeight: 600 }}>Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <div className="checkout-stepper">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>Information</div>
                <div className="divider"></div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>Payment</div>
                <div className="divider"></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>Confirmation</div>
            </div>

            {step < 3 ? (
                <div className="checkout-layout">
                    <div className="checkout-form-container">
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div className="fade-in">
                                    <h2>Contact Information</h2>
                                    <input type="email" placeholder="Email Address" required className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    <h2 className="mt-40">Shipping Address</h2>
                                    <div className="form-row">
                                        <input type="text" placeholder="First Name" required className="form-input" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                        <input type="text" placeholder="Last Name" required className="form-input" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                    </div>
                                    <input type="text" placeholder="Complete Address" required className="form-input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                    <div className="form-row">
                                        <input type="text" placeholder="City" required className="form-input" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                        <input type="text" placeholder="State" required className="form-input" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <input type="text" placeholder="Pincode" required className="form-input" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                        <input type="tel" placeholder="Phone Number" required className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                    <button type="submit" className="btn-primary w-100 mt-40">Continue to Payment</button>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="fade-in">
                                    <h2>Payment Method</h2>
                                    <div className="payment-options">
                                        {[{ v: 'COD', icon: '🚚', title: 'Cash on Delivery', sub: 'Pay upon receiving' }, { v: 'UPI', icon: '📱', title: 'UPI (GPay / PhonePe)', sub: 'Instant activation' }, { v: 'Card', icon: '💳', title: 'Debit / Credit Card', sub: 'Powered by Razorpay' }].map(opt => (
                                            <label key={opt.v} className={`payment-card ${formData.paymentMode === opt.v ? 'selected' : ''}`}>
                                                <input type="radio" name="payment" value={opt.v} checked={formData.paymentMode === opt.v} onChange={() => setFormData({ ...formData, paymentMode: opt.v })} />
                                                <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                                                <div className="payment-info"><strong>{opt.title}</strong><p>{opt.sub}</p></div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="payment-actions">
                                        <button type="button" className="btn-text" onClick={() => setStep(1)}>← Return to shipping</button>
                                        <button type="submit" className="btn-primary" disabled={submitting}>
                                            {submitting ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <aside className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-list">
                            {cartItems.map(item => (
                                <div key={item._id} className="summary-item">
                                    <div className="item-img"><img src={getImg(item._id || item.name)} alt={item.name} /></div>
                                    <div className="item-details"><strong>{item.name}</strong><p>× {item.quantity}</p></div>
                                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-totals">
                            <div className="total-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                            <div className="total-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                            <div className="total-row grand-total"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                        </div>
                    </aside>
                </div>
            ) : (
                <div className="success-view fade-in">
                    <div className="success-icon">✅</div>
                    <h1>Thank you, {formData.firstName}!</h1>
                    <p>Your order <strong>{orderNumber}</strong> has been placed successfully.</p>
                    <p>We've sent a confirmation email to <strong>{formData.email}</strong></p>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                        <Link to="/account" className="btn-primary" style={{ padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', background: '#ed6c0d', color: 'white', fontWeight: '600' }}>Track Order</Link>
                        <Link to="/" className="btn-primary" style={{ padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', background: '#1e293b', color: 'white', fontWeight: '600' }}>Continue Shopping</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
