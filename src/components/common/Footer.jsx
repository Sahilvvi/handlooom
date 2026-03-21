import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-premium">
            <div className="container">
                <div className="footer-top-grid">
                    <div className="footer-brand-section">
                        <div className="footer-logo-premium">
                            <img src="/logo.png" alt="Jannat Handloom" className="footer-logo-img" />
                        </div>
                        <p className="footer-manifesto">
                            Crafting elegance for the modern home since 1998. We specialize in artisanal handloom drapes that transform spaces through texture, light, and timeless design.
                        </p>
                        <div className="footer-contact-info">
                            <p><strong>Flagship Gallery:</strong> Delhi, India</p>
                            <p><strong>Concierge:</strong> concierge@jannatloom.com</p>
                            <p><strong>Phone:</strong> +91 99999 00000</p>
                        </div>
                    </div>

                    <div className="footer-links-column">
                        <h3>Collections</h3>
                        <ul>
                            <li><Link to="/shop?category=Sheer">Ethereal Sheers</Link></li>
                            <li><Link to="/shop?category=Velvet">Luxury Velvets</Link></li>
                            <li><Link to="/shop?category=Blackout">Blackout Drapes</Link></li>
                            <li><Link to="/shop?category=Linen">Natural Linens</Link></li>
                            <li><Link to="/shop?room=Living Room">Living Spaces</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-column">
                        <h3>Our Story</h3>
                        <ul>
                            <li><Link to="/about">The Loom Heritage</Link></li>
                            <li><Link to="/craftsmanship">Artisanal Process</Link></li>
                            <li><Link to="/press">In the Journal</Link></li>
                            <li><Link to="/contact">Bespeak Consulting</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-column">
                        <h3>Customer Care</h3>
                        <ul>
                            <li><Link to="/shipping">Shipping & Logistics</Link></li>
                            <li><Link to="/returns">The Guarantee</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom-premium">
                    <div className="footer-bottom-left">
                        <p>&copy; 2026 JANNAT HANDLOOM. Artisanal Excellence Globally.</p>
                    </div>
                    <div className="footer-bottom-right">
                        <div className="payment-methods">
                            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                            <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
                            <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" />
                            <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
