import React, { useState, useEffect } from 'react';
import './StaticPages.css';
import BASE_URL from '../utils/api';

const PageHero = ({ title, subtitle }) => (
    <div className="static-hero-ux">
        <div className="container">
            <span className="breadcrumb-ux" style={{ color: 'var(--lux-gold)', fontWeight: 800, fontSize: '0.7rem', display: 'block', marginBottom: '1.5rem', letterSpacing: '0.4em' }}>Jannat Handloom / {title}</span>
            <h1 className="static-title-ux">{title}</h1>
            <p className="static-subtitle-ux">{subtitle}</p>
        </div>
    </div>
);

export const About = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="static-page-premium">
            <PageHero title="Our Story" subtitle="Artisanal Heritage since 1998, Woven for the Modern World." />
            <div className="container static-content-lux">
                <section className="heritage-grid">
                    <div className="heritage-img-lux"><img src="https://images.unsplash.com/photo-1544161515-4ae6ce6ca606?q=80&w=2070" alt="Roots" /></div>
                    <div className="heritage-text">
                        <span className="section-subtitle">THE BEGINNING</span>
                        <h2>Artisanal Roots</h2>
                        <p>Our journey began in a small atelier, where we sought to preserve the majestic art of hand-weaving. Decades later, our drapes have transformed thousands of homes into sanctuaries of texture and light.</p>
                    </div>
                </section>

                <section className="heritage-grid reverse">
                    <div className="heritage-img-lux"><img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070" alt="Handloom" /></div>
                    <div className="heritage-text">
                        <span className="section-subtitle">THE PROCESS</span>
                        <h2>The Craft Guild</h2>
                        <p>Every Jannat drape is slow-made. Our artisans spend weeks meticulously weaving each panel, ensuring that every grain and fiber meets our uncompromising standard of luxury.</p>
                    </div>
                </section>

                <div className="stats-strip-ux" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center', padding: '100px 0' }}>
                    <div className="stat-lux"><h3>4.9/5</h3><p>Artisanal Rating</p></div>
                    <div className="stat-lux"><h3>12k+</h3><p>Elite Clients</p></div>
                    <div className="stat-lux"><h3>50+</h3><p>Global Cities</p></div>
                    <div className="stat-lux"><h3>100%</h3><p>Pure Silk & Velvet</p></div>
                </div>
            </div>
        </div>
    );
};

export const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: '', email: '', subject: '', message: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="static-page-premium">
            <PageHero title="The Consultation" subtitle="Experience Personal Bespoke Assistance for Your Home Artistry." />
            <div className="container contact-layout-ux">
                <div className="contact-form-lux">
                    <h3>Inquiry Form</h3>
                    {success ? (
                        <div className="form-success-state-lux">
                            <h2 style={{ color: 'var(--lux-gold)', marginBottom: '1.5rem' }}>✨ We have received your query.</h2>
                            <p>An artisan from our concierge team will reach out to you within 24 business hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-row-lux">
                                <input type="text" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                                <input type="email" placeholder="Email Address" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                            </div>
                            <input type="text" placeholder="Subject / Collection of Interest" style={{ width: '100%', marginBottom: '30px' }} value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} />
                            <textarea rows="6" placeholder="How can our artisans assist you?" style={{ width: '100%', marginBottom: '40px' }} required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})}></textarea>
                            <button type="submit" disabled={loading} className="btn-lux">{loading ? 'Processing Inquiry...' : 'Send Inquiry Request'}</button>
                        </form>
                    )}
                </div>

                <div className="contact-sidebar-lux">
                    <div className="widget-lux">
                        <h4>General Inquiries</h4>
                        <p>concierge@jannatloom.com</p>
                        <p>+91 99999 00000</p>
                    </div>
                    <div className="widget-lux">
                        <h4>Mumbai Flagship</h4>
                        <p>Bandra West, Luxury Plaza</p>
                        <p>Mon - Sun, 10 AM - 9 PM</p>
                    </div>
                    <div className="widget-lux">
                        <h4>Global Sales</h4>
                        <p>export@jannatloom.com</p>
                    </div>
                    <div className="widget-lux">
                        <h4>Follow Our Artistry</h4>
                        <p>Instagram: @jannathandloom</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Shipping = () => (
    <div className="static-page-premium">
        <PageHero title="Global Logistics" subtitle="Every piece is handled as a fragile textile artifact." />
        <div className="container"><p style={{ padding: '100px 0', fontSize: '1.25rem' }}>We deliver our artisanal drapes to over 50 countries with the same care as our weaving. Standard delivery within India is complimentary for all premium collections above ₹999.</p></div>
    </div>
);

export const Returns = () => (
    <div className="static-page-premium">
        <PageHero title="The Craft Guarantee" subtitle="15-Day Luxury Returns & Lifetime Stitching Support." />
        <div className="container"><p style={{ padding: '100px 0', fontSize: '1.25rem' }}>If you are not enchanted by the texture or light of your curation, we offer a seamless 15-day return policy. Products must be unused and in original premium packaging.</p></div>
    </div>
);
