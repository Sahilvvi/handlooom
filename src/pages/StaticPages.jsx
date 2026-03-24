import React from 'react';
import './StaticPages.css';
import BASE_URL from '../utils/api';

const StaticPage = ({ title, subtitle, children }) => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="static-page-premium fade-in">
            <div className="static-page-hero">
                <div className="container">
                    <span className="static-bread">Jannat Handloom • {title}</span>
                    <h1 className="static-title-main">{title}</h1>
                    {subtitle && <p className="static-subtitle">{subtitle}</p>}
                </div>
            </div>
            <div className="container">
                <div className="static-content-card">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const About = () => (
    <StaticPage 
        title="Our Story" 
        subtitle="Woven with Heritage, Driven by Excellence"
    >
        <section className="story-section fade-in">
            <div className="story-grid">
                <div className="story-image">
                    <img src="/home/heritage.png" alt="Our Roots" />
                </div>
                <div className="story-text">
                    <span className="section-tag">Established 1998</span>
                    <h2>Our Roots</h2>
                    <p>Jannat Handloom began as a small family atelier in the heart of Delhi. Our founder, driven by a passion for traditional weaving techniques and modern aesthetics, sought to bring the luxury of handloom drapes to contemporary homes across the world.</p>
                </div>
            </div>
        </section>

        <section className="story-section fade-in">
            <div className="story-grid reverse">
                <div className="story-text">
                    <span className="section-tag">Artisanal Process</span>
                    <h2>The Handloom Art</h2>
                    <p>Every piece in our collection is a labor of love. Our artisans spend weeks on a single drape, ensuring that every thread is perfectly placed. We believe that true luxury cannot be mass-produced; it must be felt in the texture and seen in the intricate details of hand-crafted work.</p>
                </div>
                <div className="story-image">
                    <img src="/home/velvet.png" alt="Handloom Process" />
                </div>
            </div>
        </section>

        <section className="story-stats-section fade-in">
            <div className="stats-grid-premium">
                <div className="stat-card">
                    <h3>25+</h3>
                    <p>Years of Legacy</p>
                </div>
                <div className="stat-card">
                    <h3>200+</h3>
                    <p>Expert Artisans</p>
                </div>
                <div className="stat-card">
                    <h3>10k+</h3>
                    <p>Happy Homes</p>
                </div>
                <div className="stat-card">
                    <h3>100%</h3>
                    <p>Ethical Sourcing</p>
                </div>
            </div>
        </section>

        <section className="story-section fade-in">
            <div className="story-text full-width center">
                <span className="section-tag">Our Philosophy</span>
                <h2>Sustainable Elegance</h2>
                <p>We are committed to preserving not just our heritage, but also our planet. Our materials are sourced from sustainable farms, and our production processes are designed to minimize waste while maximizing the artistic value of every thread.</p>
            </div>
        </section>
    </StaticPage>
);

export const Shipping = () => (
    <StaticPage 
        title="Shipping & Delivery" 
        subtitle="Global logistics handled with the same care as our weaving."
    >
        <div className="policy-block">
            <h3>Standard Delivery</h3>
            <p>We offer premium shipping on all orders above ₹999 across India. For orders below this amount, a nominal shipping fee of ₹99 is applicable to ensure safe transit.</p>
            <p>Standard delivery typically takes 5-7 business days. Every package is handled as a fragile textile artifact.</p>
        </div>
        <div className="policy-block">
            <h3>Tracking Your Order</h3>
            <p>Once your order is dispatched from our loom, you will receive a tracking link via email and SMS for real-time monitoring of your shipment's journey.</p>
        </div>
    </StaticPage>
);

export const Returns = () => (
    <StaticPage 
        title="The Guarantee" 
        subtitle="Our commitment to excellence extends beyond the purchase."
    >
        <div className="policy-block">
            <h3>Returns & Exchanges</h3>
            <p>At Jannat Handloom, we strive for 100% customer satisfaction. If you are not completely enchanted by your purchase, you can initiate a return within 7 days of delivery.</p>
            <p>The product must be unused, unwashed, and in its original premium packaging with all tags intact. Refunds are processed within 5-7 working days after our quality artisans verify the returned item.</p>
        </div>
    </StaticPage>
);

export const Privacy = () => (
    <StaticPage 
        title="Privacy Policy" 
        subtitle="Commitment to your digital discretion."
    >
        <p>Your privacy is paramount. This policy outlines how we collect, use, and protect your personal information when you use our platform.</p>
        <p>We never share your personal data with third parties for marketing purposes. All transactions are secured through high-level encrypted gateways.</p>
    </StaticPage>
);

export const Faq = () => (
    <StaticPage 
        title="Common Enquiries" 
        subtitle="Finding clarity in the world of luxury handlooms."
    >
        <div className="faq-grid-premium">
            <div className="faq-item-premium">
                <h3>How do I track my bespoke order?</h3>
                <p>You can track your order using the link sent to your registered email or mobile number. Our concierge team is also available for personal updates.</p>
            </div>
            <div className="faq-item-premium">
                <h3>Do you offer curtain customization?</h3>
                <p>Currently, we offer standard premium sizes as listed. We are preparing to launch our 'Bespeak' service for custom dimensions soon.</p>
            </div>
            <div className="faq-item-premium">
                <h3>The fabric looks different in person. Why?</h3>
                <p>Our handloom fabrics are artisanal and react beautifully to different lighting. Minor variations in grain and texture are hallmarks of authentic hand-weaving.</p>
            </div>
        </div>
    </StaticPage>
);

export const Career = () => (
    <StaticPage 
        title="Careers" 
        subtitle="Join our collective of modern artisans and visionaries."
    >
        <p>We are always seeking passionate individuals in design, textile engineering, and luxury marketing.</p>
        <p>Direct your inquiries and portfolio to <strong>careers@jannatloom.com</strong>.</p>
    </StaticPage>
);

export const OurStores = () => (
    <StaticPage 
        title="Experience Centers" 
        subtitle="Witness the texture and light of our collections in person."
    >
        <div className="stores-grid-premium">
            <div className="store-card-premium">
                <span className="store-tag">Flagship</span>
                <h3>Mumbai Flagship Store</h3>
                <p>123, Handloom Plaza, Bandra West, Mumbai - 400050</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="store-cta">View on Map →</a>
            </div>
            <div className="store-card-premium">
                <span className="store-tag">Experience Center</span>
                <h3>Delhi Luxury Gallery</h3>
                <p>45, Rajouri Garden, Main Market, New Delhi - 110027</p>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="store-cta">View on Map →</a>
            </div>
        </div>
    </StaticPage>
);

export const Contact = () => {
    const [form, setForm] = React.useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [status, setStatus] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setForm({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                setStatus(data.message || 'Something went wrong');
            }
        } catch {
            setStatus('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StaticPage 
            title="Contact Us" 
            subtitle="Bespoke Assistance for Your Beautiful Home"
        >
            <div className="contact-main-grid fade-in">
                <div className="contact-info-panel">
                    <div className="contact-header-premium">
                        <span className="section-tag">Get in Touch</span>
                        <h2>Send an Inquiry</h2>
                        <p>Our concierge remains available to assist you with styling consultations, order tracking, or any artisanal inquiries.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="form-success-state-premium">
                            <div className="success-lottie">✓</div>
                            <h3>Inquiry Received</h3>
                            <p>An artisan from our concierge team will reach out to you at the earliest.</p>
                            <button onClick={() => setStatus('')} className="premium-btn-alt">Send Another Message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="premium-contact-form">
                            <div className="premium-input-row">
                                <div className="premium-input-group">
                                    <input name="name" value={form.name} onChange={handleChange} required placeholder=" " id="form_name" />
                                    <label htmlFor="form_name">Full Name</label>
                                </div>
                                <div className="premium-input-group">
                                    <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder=" " id="form_email" />
                                    <label htmlFor="form_email">Email Address</label>
                                </div>
                            </div>
                            <div className="premium-input-group">
                                <input name="subject" value={form.subject} onChange={handleChange} placeholder=" " id="form_subject" />
                                <label htmlFor="form_subject">Subject (Optional)</label>
                            </div>
                            <div className="premium-input-group">
                                <textarea name="message" value={form.message} onChange={handleChange} required placeholder=" " id="form_message" rows={6} />
                                <label htmlFor="form_message">How can we assist you today?</label>
                            </div>
                            
                            <button type="submit" disabled={loading} className="premium-form-submit">
                                {loading ? (
                                    <span className="loader-text">Processing...</span>
                                ) : (
                                    <span className="button-content">Send Message <i className="icon-arrow-right"></i></span>
                                )}
                            </button>
                            
                            {typeof status === 'string' && status && status !== 'success' && (
                                <div className="premium-form-error">{status}</div>
                            )}
                        </form>
                    )}
                </div>

                <div className="contact-sidebar-premium">
                    <div className="contact-widget">
                        <h3>Direct Concierge</h3>
                        <div className="widget-item">
                            <i className="icon">✉</i>
                            <div>
                                <span>Support Email</span>
                                <p>concierge@jannatloom.com</p>
                            </div>
                        </div>
                        <div className="widget-item">
                            <i className="icon">📞</i>
                            <div>
                                <span>Bespoke Sales</span>
                                <p>+91 99999 00000</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-widget accent">
                        <h3>Experience Centers</h3>
                        <div className="widget-item">
                            <i className="icon">📍</i>
                            <div>
                                <span>Delhi Showroom</span>
                                <p>102, Handloom Plaza, Sector 18, Delhi, 110027</p>
                            </div>
                        </div>
                        <div className="widget-item">
                            <i className="icon">📍</i>
                            <div>
                                <span>Mumbai Gallery</span>
                                <p>45, Heritage Road, Bandra West, Mumbai, 400050</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-social-tease">
                        <span>Follow Our Artistry</span>
                        <div className="social-links-minimal">
                            <a href="#">Instagram</a>
                            <a href="#">Pinterest</a>
                            <a href="#">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>

            <section className="contact-faq-tease">
                <div className="tease-header">
                    <h2>Immediate Clarity</h2>
                    <p>Brief answers to our most frequent artisanal inquiries.</p>
                </div>
                <div className="tease-grid">
                    <div className="tease-card">
                        <h4>Global Logistics</h4>
                        <p>We deliver our artisanal drapes to over 50 countries worldwide with specialized handle-with-care packaging.</p>
                    </div>
                    <div className="tease-card">
                        <h4>Bespoke Sizes</h4>
                        <p>Custom dimensions can be crafted for your specific windows. Simply mention 'Bespoke' in your inquiry.</p>
                    </div>
                    <div className="tease-card">
                        <h4>Lead Times</h4>
                        <p>As every piece is hand-woven, please allow 7-12 business days for your order to be ready for its journey.</p>
                    </div>
                </div>
            </section>
        </StaticPage>
    );
};
