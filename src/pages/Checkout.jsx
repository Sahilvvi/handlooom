import React, { useState } from 'react';
import './Checkout.css';

const Checkout = () => {
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        paymentMode: 'UPI'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) setStep(2);
        else if (step === 2) setStep(3);
    };

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
                                        <input type="text" placeholder="Pincode" required className="form-input" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                    </div>
                                    <input type="tel" placeholder="Phone Number" required className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                                    <button type="submit" className="btn-primary w-100 mt-40">Continue to Payment</button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="fade-in">
                                    <h2>Payment Method</h2>
                                    <div className="payment-options">
                                        <label className={`payment-card ${formData.paymentMode === 'UPI' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="UPI" checked={formData.paymentMode === 'UPI'} onChange={() => setFormData({ ...formData, paymentMode: 'UPI' })} />
                                            <div className="payment-info">
                                                <strong>UPI (Google Pay, PhonePe, Paytm)</strong>
                                                <p>Instant activation</p>
                                            </div>
                                            <img src="https://img.icons8.com/color/48/000000/upi.png" alt="UPI" width="40" />
                                        </label>
                                        <label className={`payment-card ${formData.paymentMode === 'Card' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="Card" checked={formData.paymentMode === 'Card'} onChange={() => setFormData({ ...formData, paymentMode: 'Card' })} />
                                            <div className="payment-info">
                                                <strong>Debit / Credit Card</strong>
                                                <p>Powered by Razorpay</p>
                                            </div>
                                            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" width="40" />
                                        </label>
                                        <label className={`payment-card ${formData.paymentMode === 'COD' ? 'selected' : ''}`}>
                                            <input type="radio" name="payment" value="COD" checked={formData.paymentMode === 'COD'} onChange={() => setFormData({ ...formData, paymentMode: 'COD' })} />
                                            <div className="payment-info">
                                                <strong>Cash on Delivery</strong>
                                                <p>Pay upon receiving</p>
                                            </div>
                                            <span>🚚</span>
                                        </label>
                                    </div>

                                    <div className="payment-actions">
                                        <button type="button" className="btn-text" onClick={() => setStep(1)}>Return to shipping</button>
                                        <button type="submit" className="btn-primary">Complete Order</button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <aside className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-list">
                            <div className="summary-item">
                                <div className="item-img"><img src="https://images.unsplash.com/photo-1541004995602-b3e89b7899a2?q=80&w=100" alt="Prod" /></div>
                                <div className="item-details">
                                    <strong>Noor Linen Sheer Curtain</strong>
                                    <p>Ivory / 7ft</p>
                                </div>
                                <span>₹1,899</span>
                            </div>
                        </div>
                        <div className="promo-code">
                            <input type="text" placeholder="Discount Code" />
                            <button>Apply</button>
                        </div>
                        <div className="summary-totals">
                            <div className="total-row"><span>Subtotal</span><span>₹1,899</span></div>
                            <div className="total-row"><span>Shipping</span><span>Free</span></div>
                            <div className="total-row grand-total"><span>Total</span><span>₹1,899</span></div>
                        </div>
                    </aside>
                </div>
            ) : (
                <div className="success-view fade-in">
                    <div className="success-icon">✨</div>
                    <h1>Thank you, {formData.firstName}!</h1>
                    <p>Your order #JANNAT-8923 has been placed successfully.</p>
                    <p>We've sent a confirmation email to {formData.email}</p>
                    <a href="/" className="btn-primary mt-40">Continue Shopping</a>
                </div>
            )}
        </div>
    );
};

export default Checkout;
