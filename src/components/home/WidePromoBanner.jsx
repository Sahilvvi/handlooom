import React from 'react';
import './WidePromoBanner.css';

const WidePromoBanner = () => {
    return (
        <section className="wide-promo-section">
            <div className="container">
                <div className="wide-banner">
                    <div className="wide-banner-content">
                        <div className="left-promo">
                            <span className="splash-text">Splash of</span>
                            <h2 className="colours-text">COLOURS <span>Sale</span></h2>
                        </div>
                        <div className="divider"></div>
                        <div className="middle-promo">
                            <span className="upto">UPTO</span>
                            <span className="percent">50%OFF</span>
                            <span className="plus">+</span>
                            <div className="cashback">
                                <span className="upto-small">UPTO</span>
                                <span className="amount">10,000</span>
                            </div>
                        </div>
                        <div className="right-promo">
                            <span className="cashback-label">Cashback Discount</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WidePromoBanner;
