import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-newsletter">
                <div className="container newsletter-container">
                    <div className="newsletter-text">
                        <h3>Join the Jannat Circles</h3>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                    </div>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit" className="btn-primary">Subscribe</button>
                    </form>
                </div>
            </div>

            <div className="footer-main">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <a href="/" className="logo">
                            <h2>JANNAT</h2>
                            <span>HANDLOOM</span>
                        </a>
                        <p className="brand-desc">
                            Premium Handloom Curtains Crafted with Love. Elevating Indian homes with affordable luxury and timeless designs.
                        </p>
                        <div className="social-links">
                            {['facebook', 'instagram', 'pinterest', 'twitter'].map((social) => (
                                <a href={`#${social}`} key={social} aria-label={social}>
                                    <i className={`fab fa-${social}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/shop">All Products</a></li>
                            <li><a href="/category/best-sellers">Best Sellers</a></li>
                            <li><a href="/category/new-arrivals">New Arrivals</a></li>
                            <li><a href="/about">Our Story</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Collections</h4>
                        <ul>
                            <li><a href="/category/blackout">Blackout Curtains</a></li>
                            <li><a href="/category/sheer">Sheer Curtains</a></li>
                            <li><a href="/category/printed">Printed Curtains</a></li>
                            <li><a href="/category/velvet">Velvet Curtains</a></li>
                            <li><a href="/category/linen">Linen Curtains</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Help</h4>
                        <ul>
                            <li><a href="/shipping-policy">Shipping Policy</a></li>
                            <li><a href="/return-policy">Refund & Returns</a></li>
                            <li><a href="/faq">FAQs</a></li>
                            <li><a href="/privacy-policy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-container">
                    <p>&copy; 2026 Jannat Handloom. All Rights Reserved.</p>
                    <div className="payment-methods">
                        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                        <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
                        <img src="https://img.icons8.com/color/48/000000/google-pay.png" alt="GPay" />
                        <img src="https://img.icons8.com/color/48/000000/upi.png" alt="UPI" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
