import React from 'react';
import './Home.css'; // Reusing some container styles

const StaticPage = ({ title, children }) => (
    <div className="container" style={{ padding: '80px 20px', minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '30px', color: '#333', fontSize: '2.5rem' }}>{title}</h1>
        <div style={{ lineHeight: '1.8', color: '#666', fontSize: '1.1rem' }}>
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

export const Contact = () => (
    <StaticPage title="Contact Us">
        <p>We're here to help! Reach out to us for any queries or support.</p>
        <div style={{ marginTop: '20px' }}>
            <p><strong>Phone:</strong> +91 98765 43210 (Mon-Sat, 10 AM - 7 PM)</p>
            <p><strong>Email:</strong> help@jannatloom.com</p>
            <p><strong>Address:</strong> Jannat Handloom HQ, Sector 62, Noida, UP - 201301</p>
        </div>
    </StaticPage>
);
