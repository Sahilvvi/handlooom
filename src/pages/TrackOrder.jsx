import React, { useState } from 'react';
import BASE_URL from '../utils/api';
import './TrackOrder.css';

const STATUS_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
const STATUS_INDEX = { placed: 0, confirmed: 1, shipped: 2, delivered: 3 };

const TrackOrder = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        if (!orderNumber.trim()) { setError('Please enter your order number'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/orders/track/${orderNumber.trim()}`);
            if (!res.ok) { setError('Order not found. Please check your order number.'); setLoading(false); return; }
            const data = await res.json();
            setOrder(data);
        } catch {
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const currentStep = order ? (STATUS_INDEX[order.status?.toLowerCase()] ?? 0) : 0;

    return (
        <div className="track-page">
            <div className="container">
                <div className="track-header">
                    <h1>📦 Track Your Order</h1>
                    <p>Enter your order number to get real-time status updates</p>
                </div>

                <form className="track-form" onSubmit={handleTrack}>
                    <div className="track-input-group">
                        <input
                            type="text"
                            placeholder="Enter order number (e.g. JH-20260303-1234)"
                            value={orderNumber}
                            onChange={e => setOrderNumber(e.target.value)}
                            className="track-input"
                        />
                        <button type="submit" className="btn-track" disabled={loading}>
                            {loading ? 'Searching...' : 'Track Order →'}
                        </button>
                    </div>
                    {error && <p className="track-error">{error}</p>}
                </form>

                {order && (
                    <div className="track-result">
                        <div className="order-meta">
                            <div className="meta-item"><span>Order No.</span><strong>{order.orderNumber}</strong></div>
                            <div className="meta-item"><span>Total</span><strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong></div>
                            <div className="meta-item"><span>Payment</span><strong>{order.paymentMode}</strong></div>
                            <div className="meta-item"><span>Date</span><strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
                        </div>

                        {/* Status Timeline */}
                        <div className="status-timeline">
                            {STATUS_STEPS.map((step, i) => (
                                <div key={step} className={`timeline-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
                                    <div className="step-circle">
                                        {i < currentStep ? '✓' : i + 1}
                                    </div>
                                    <div className="step-label">{step}</div>
                                    {i < STATUS_STEPS.length - 1 && <div className={`step-line ${i < currentStep ? 'done' : ''}`} />}
                                </div>
                            ))}
                        </div>

                        {/* Items */}
                        <div className="order-items-section">
                            <h3>Items Ordered</h3>
                            {(order.items || []).map((item, i) => (
                                <div key={i} className="track-item">
                                    <div className="track-item-info">
                                        <span className="track-item-name">{item.name}</span>
                                        <span className="track-item-qty">× {item.quantity}</span>
                                    </div>
                                    <span className="track-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Address */}
                        {order.shippingAddress && (
                            <div className="delivery-address">
                                <h3>Delivery Address</h3>
                                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city} — {order.shippingAddress.pincode}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
