import React from 'react';
import './StaticPages.css';
import BASE_URL from '../utils/api';

const StaticPage = ({ title, children }) => (
    <div className="static-page-container container">
        <h1 className="static-page-title">{title}</h1>
        <div className="static-page-content">
            {children}
        </div>
    </div>
);

export const About = () => (
    <StaticPage title="About Us">
        <p>Welcome to <strong>Jannat Handloom</strong>, India's premier destination for high-quality curtains and home furnishings. Founded with a vision to bring factory-premium quality directly to Indian homes, we specialize in a wide range of handloom products that combine traditional craftsmanship with modern design.</p>
        <p>Our collection is curated to enhance every corner of your home, from living rooms to bedrooms, ensuring comfort, style, and durability.</p>
    </StaticPage>
);

export const Shipping = () => (
    <StaticPage title="Shipping Policy">
        <p>We offer free shipping on all orders above ₹999 across India. For orders below this amount, a nominal shipping fee of ₹99 is applicable.</p>
        <p>Standard delivery takes 5-7 business days. Once your order is shipped, you will receive a tracking ID via email and SMS.</p>
    </StaticPage>
);

export const Returns = () => (
    <StaticPage title="Return Policy">
        <p>At Jannat Handloom, we strive for 100% customer satisfaction. If you are not happy with your purchase, you can return it within 7 days of delivery.</p>
        <p>The product must be unused, unwashed, and in its original packaging with all tags intact. Refunds are processed within 5-7 working days after quality check.</p>
    </StaticPage>
);

export const Privacy = () => (
    <StaticPage title="Privacy Policy">
        <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information when you use our website.</p>
        <p>We do not share your personal data with third parties for marketing purposes. All transactions are secured with industry-standard encryption.</p>
    </StaticPage>
);

export const Faq = () => (
    <StaticPage title="FAQs">
        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#333' }}>How do I track my order?</h3>
            <p>You can track your order using the link sent to your registered email or mobile number.</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#333' }}>Do you offer customization?</h3>
            <p>Currently, we offer standard sizes as listed on the product pages. Stay tuned for our upcoming customized services!</p>
        </div>
    </StaticPage>
);

export const Career = () => (
    <StaticPage title="Career">
        <p>Join the team at Jannat Handloom! We are always looking for passionate individuals in design, marketing, and operations.</p>
        <p>Send your resume to <strong>careers@jannatloom.com</strong> to explore current openings.</p>
    </StaticPage>
);

export const OurStores = () => (
    <StaticPage title="Our Stores">
        <p>Experience our products in person at our experience centers.</p>
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#333' }}>Mumbai flagship Store</h3>
            <p>123, Handloom Plaza, Bandra West, Mumbai - 400050</p>
        </div>
        <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#333' }}>Delhi Experience Center</h3>
            <p>45, Rajouri Garden, Main Market, New Delhi - 110027</p>
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
        <div className="static-page-container container">
            <div className="contact-layout">
                {/* Info */}
                <div>
                    <h1 className="static-page-title">Contact Us</h1>
                    <p style={{ color: '#64748b', marginBottom: '30px', lineHeight: 1.7 }}>We're here to help with any queries about orders, products, or returns. Reach out — we respond within 24 hours.</p>
                    <div className="contact-info-list">
                        {[
                            { icon: '📞', label: 'Phone', val: '+91 98765 43210 (Mon-Sat, 10AM-7PM)' },
                            { icon: '📧', label: 'Email', val: 'help@jannatloom.com' },
                            { icon: '📍', label: 'Address', val: 'Jannat Handloom HQ, Sector 62, Noida, UP - 201301' },
                            { icon: '🕐', label: 'Hours', val: 'Monday to Saturday, 10AM - 7PM IST' }
                        ].map(({ icon, label, val }) => (
                            <div key={label} className="contact-info-item">
                                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                                <div><strong style={{ display: 'block', color: '#334155', fontSize: '0.85rem', marginBottom: '4px' }}>{label}</strong><span style={{ color: '#64748b' }}>{val}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Form */}
                <div className="contact-form-card">
                    {status === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                            <h3 style={{ color: '#16a34a', marginBottom: '8px' }}>Message Sent!</h3>
                            <p style={{ color: '#64748b' }}>We'll get back to you within 24 hours.</p>
                            <button onClick={() => setStatus('')} style={{ marginTop: '20px', background: '#EF6F31', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Send Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1e293b' }}>Send us a message</h2>
                            {typeof status === 'string' && status && status !== 'success' && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '0.9rem' }}>{status}</div>}
                            <div className="contact-form-grid">
                                {[['name', 'Full Name', 'text', true], ['email', 'Email Address', 'email', true],].map(([n, ph, t, req]) => (
                                    <input key={n} name={n} value={form[n]} onChange={handleChange} placeholder={ph} type={t} required={req} style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }} />
                                ))}
                            </div>
                            <div className="contact-form-grid">
                                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" type="tel" style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }} />
                                <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }} />
                            </div>
                            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." required rows={5} style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }} />
                            <button type="submit" disabled={loading} style={{ background: '#EF6F31', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>
                                {loading ? 'Sending...' : '✉️ Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
