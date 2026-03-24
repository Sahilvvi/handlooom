import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BASE_URL, { getImgUrl } from '../utils/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
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
    const [error, setError] = useState('');

    const shipping = cartTotal >= 4999 ? 0 : 150;
    const total = cartTotal + shipping;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0,0);
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('jannat_token');
            const orderPayload = {
                items: cartItems.map(item => ({
                    product: item._id, name: item.name, price: item.price || 0,
                    quantity: item.quantity || 1, size: item.size || ''
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

            if (formData.paymentMode === 'COD') {
                const res = await fetch(`${BASE_URL}/api/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
                    body: JSON.stringify(orderPayload)
                });
                const data = await res.json();
                if (res.ok) { setOrderNumber(data.orderNumber); clearCart(); setStep(3); } 
                else { setError(data.message || 'Payment processing error'); }
            } 
            else {
                const sdkRes = await loadRazorpay();
                if (!sdkRes) { alert("Secure Gateway unavailable."); setSubmitting(false); return; }

                const orderRes = await fetch(`${BASE_URL}/api/payments/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total, currency: 'INR' })
                });
                const razorpayOrder = await orderRes.json();

                const options = {
                    key: "rzp_live_SUdnaFrzLtWS41",
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "Jannat Handloom",
                    description: "Order Checkout",
                    order_id: razorpayOrder.id,
                    handler: async (response) => {
                        const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        const verifyData = await verifyRes.json();
                        
                        if (verifyData.status === 'success') {
                            const finalRes = await fetch(`${BASE_URL}/api/orders`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
                                body: JSON.stringify({ 
                                    ...orderPayload, 
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpayPaymentId: response.razorpay_payment_id, 
                                    razorpaySignature: response.razorpay_signature,
                                    paymentStatus: 'paid' 
                                })
                            });
                            const finalData = await finalRes.json();
                            if (finalRes.ok) { setOrderNumber(finalData.orderNumber); clearCart(); setStep(3); }
                        }
                    },
                    prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
                    theme: { color: "#C5A059" }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            setError('Global synchronization error. Refresh and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (cartItems.length === 0 && step < 3) {
        return (
            <div className="premium-empty-view container">
                <h1>Cart Intention</h1>
                <p>Your journey begins with selecting a masterpiece.</p>
                <Link to="/shop" className="btn-luxury">Explore Boutique</Link>
            </div>
        );
    }

    return (
        <div className="checkout-premium-page container">
            <header className="checkout-header-alt">
                <div className="stepper-luxury">
                    <span className={step >= 1 ? 'active' : ''}>Destiny</span>
                    <span className={step >= 2 ? 'active' : ''}>Payment</span>
                    <span className={step >= 3 ? 'active' : ''}>Confirmation</span>
                </div>
            </header>

            <div className="checkout-main-grid">
                <section className="checkout-input-zone">
                    {step === 1 && (
                        <form onSubmit={handleStep1Submit} className="premium-form-step">
                            <div className="form-section-luxury">
                                <h3>Contact Narrative</h3>
                                <div className="input-group-luxury active">
                                    <input type="email" placeholder=" " required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                    <label>Email Address</label>
                                </div>
                            </div>

                            <div className="form-section-luxury">
                                <h3>Shipping Coordinates</h3>
                                <div className="dual-inputs">
                                    <div className="input-group-luxury active">
                                        <input type="text" placeholder=" " required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                        <label>First Name</label>
                                    </div>
                                    <div className="input-group-luxury active">
                                        <input type="text" placeholder=" " required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                        <label>Last Name</label>
                                    </div>
                                </div>
                                <div className="input-group-luxury active">
                                    <input type="text" placeholder=" " required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                                    <label>Full Address</label>
                                </div>
                                <div className="dual-inputs">
                                    <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                    <input type="text" placeholder="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                                </div>
                                <div className="dual-inputs">
                                    <input type="text" placeholder="Pincode" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                                    <input type="tel" placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="btn-luxury-lg">Confirm Address</button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="premium-payment-step">
                            <h3>Selection Method</h3>
                            <div className="payment-grid-luxury">
                                {['COD', 'Online'].map(m => (
                                    <div key={m} className={`payment-card-alt ${formData.paymentMode === m ? 'active' : ''}`} onClick={() => setFormData({...formData, paymentMode: m})}>
                                        <div className="dot"></div>
                                        <div className="txt">
                                            <strong>{m === 'COD' ? 'Traditional COD' : 'Secure Digital'}</strong>
                                            <span>{m === 'COD' ? 'Pay at your doorstep' : 'Cards, UPI, Netbanking'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="final-actions">
                                <button onClick={() => setStep(1)} className="btn-back">Edit Address</button>
                                <button onClick={handleFinalSubmit} className="btn-luxury-lg" disabled={submitting}>
                                    {submitting ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
                                </button>
                            </div>
                            {error && <p className="error-alert">{error}</p>}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="checkout-success-luxury">
                            <div className="success-lottie">✓</div>
                            <h1>Gratitude Expressed</h1>
                            <p>Order {orderNumber} has been secured. A vision of elegance is on its way.</p>
                            <div className="success-btns">
                                <Link to="/account/orders" className="btn-luxury">Track Order</Link>
                                <Link to="/" className="btn-luxury-white">Home</Link>
                            </div>
                        </div>
                    )}
                </section>

                {step < 3 && (
                    <aside className="checkout-summary-luxury">
                        <div className="summary-card-inner">
                            <h3>Curated Choice</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item._id} className="summary-item-alt">
                                        <div className="img-box">
                                            <img src={getImgUrl(item.images?.[0])} alt={item.name} />
                                        </div>
                                        <div className="info-box">
                                            <strong>{item.name}</strong>
                                            <span>Qty: {item.quantity}</span>
                                        </div>
                                        <div className="price-box">₹{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-foot">
                                <div className="row"><span>Authenticity Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
                                <div className="row"><span>Boutique Shipping</span><span>{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span></div>
                                <div className="row grand"><span>Final Investment</span><span>₹{total.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default Checkout;
