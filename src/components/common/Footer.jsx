import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="container footer-grid">
                    <div className="footer-column brand-col">
                        <div className="footer-logo">JANNAT <span>HANDLOOM</span></div>
                        <p className="footer-desc">
                            India's leading Handloom destination. We bring you premium quality curtains and home furnishings at factory prices.
                        </p>
                        <div className="footer-social">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                            <a href="#"><i className="fab fa-pinterest"></i></a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Our Company</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/career">Career</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/stores">Our Stores</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Useful Links</h4>
                        <ul>
                            <li><Link to="/shipping">Shipping Policy</Link></li>
                            <li><Link to="/returns">Return Policy</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Shop By Room</h4>
                        <ul>
                            <li><a href="/shop/living">Living Room</a></li>
                            <li><a href="/shop/bedroom">Bedroom</a></li>
                            <li><a href="/shop/kitchen">Kitchen</a></li>
                            <li><a href="/shop/dining">Dining Room</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Need Help?</h4>
                        <div className="help-box">
                            <p>Call: +91 98765 43210</p>
                            <p>Email: help@jannatloom.com</p>
                        </div>
                        <div className="app-badges">
                            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200" alt="App Store" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-flex">
                    <div className="payment-trust">
                        <div className="payment-icons">
                            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                            <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" />
                            <img src="https://img.icons8.com/color/48/000000/google-pay.png" alt="GPay" />
                            <img src="https://img.icons8.com/color/48/000000/upi.png" alt="UPI" />
                        </div>
                        <div className="trust-badges">
                            <span>100% Secure Payment</span>
                            <span>Verified Trusted Store</span>
                        </div>
                    </div>
                    <p className="copyright">&copy; 2026 Jannat Handloom. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
