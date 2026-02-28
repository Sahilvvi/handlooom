import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Specifications');
    const [pincode, setPincode] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);

    // Real images for gallery enrichment
    const galleryImages = ['/s1.png', '/s2.png', '/d1.png', '/d2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png', '/h1.png', '/h2.png', '/q1.png', '/q2.png', '/q3.png'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, allRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/products/${id}`),
                    fetch(`http://localhost:5000/api/products`)
                ]);
                const productData = await productRes.json();
                const allData = await allRes.json();

                // Merge real images if needed or just use them
                if (productData) {
                    const combinedImages = [...(productData.images || [])];
                    if (combinedImages.length < 5) {
                        combinedImages.push(...galleryImages.slice(0, 5 - combinedImages.length));
                    }
                    productData.images = combinedImages;
                }

                setProduct(productData);
                const similar = (allData || []).filter(p => p.category && productData.category && p.category === productData.category && p._id !== id);
                setSimilarProducts(similar.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="loading-container container">Loading Product Details...</div>;
    if (!product) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Product not found.</div>;

    const currentPrice = product.price || 840;
    const originalPrice = product.originalPrice || currentPrice * 3;
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    const offers = [
        { title: 'Store Discount', desc: 'Get Instant Extra Discount* Experience this product in-store and enjoy special additional savings.', link: 'BOOK A VISIT' },
        { title: '5% Instant Discount', desc: 'on HDFC Bank Credit & Debit Card EMI', icon: '🏦' },
        { title: 'Easy EMI', desc: 'Get it for ₹41/m', icons: ['🏦', '💳'] }
    ];

    const specifications = [
        { label: 'Material', value: product.material || 'Polyester Spandex' },
        { label: 'Color', value: product.color || 'Blue' },
        { label: 'Size', value: '5 Feet' },
        { label: 'Pack Content', value: '2 PC Window Curtain' },
        { label: 'Brand', value: 'Jannat Handloom' },
        { label: 'Dimensions (inches)', value: '44 W x 60 H' }
    ];

    const faqs = [
        { q: 'How to determine the right width and length of your curtain?', a: 'Measure from the top of the rod to where you want the curtain to end.' },
        { q: 'What is the purpose of curtains?', a: 'To provide privacy, block light, and enhance home decor.' },
        { q: 'What material in curtains do you provide?', a: 'We provide Polyester, Cotton, Jute, and more.' }
    ];

    const productImages = product.images || galleryImages.slice(0, 5);

    return (
        <div className="product-detail-page container">
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
            </div>

            <div className="product-main-view">
                <div className="product-gallery">
                    <div className="main-image-carousel">
                        <img src={productImages[mainImage]} alt={product.name} />
                        <button className="nav-btn prev" onClick={() => setMainImage((mainImage - 1 + productImages.length) % productImages.length)}>‹</button>
                        <button className="nav-btn next" onClick={() => setMainImage((mainImage + 1) % productImages.length)}>›</button>
                        <div className="gallery-actions">
                            <button className="share-btn">🔗</button>
                            <button className="wish-btn">❤️</button>
                        </div>
                    </div>
                    <div className="thumbnail-strip">
                        {productImages.map((img, i) => (
                            <div
                                key={i}
                                className={`thumb-box ${mainImage === i ? 'active' : ''}`}
                                onClick={() => setMainImage(i)}
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-details-content">
                    <h1 className="product-main-title">{product.name} - Set of 2 ({product.color || 'Premium'}, 5 Feet)</h1>
                    <div className="review-link">Write a review</div>

                    <div className="price-box">
                        <div className="current-price-row">
                            <span className="price-val">₹{currentPrice.toLocaleString('en-IN')}</span>
                            <span className="discount-pct">{discount}% Off</span>
                            <span className="info-icon">ⓘ</span>
                        </div>
                        <div className="mrp-row">MRP <span className="mrp-val">₹{originalPrice.toLocaleString('en-IN')}</span></div>
                    </div>

                    <div className="offers-section">
                        <div className="offers-header">
                            <span>Save Extra with Below Offers</span>
                            <span className="timer">⏰ Sale Ends In 6d 23h 43m 16s</span>
                        </div>
                        <div className="offers-grid">
                            {offers.map((offer, i) => (
                                <div key={i} className="offer-card">
                                    <h4>{offer.title}</h4>
                                    <p>{offer.desc}</p>
                                    {offer.link && <a href="#">{offer.link}</a>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="delivery-check">
                        <div className="check-header">🚚 Check delivery & assembly details</div>
                        <div className="pincode-input-group">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <button className="check-btn">CHECK</button>
                        </div>
                    </div>

                    <div className="cta-row">
                        <div className="qty-select">
                            <span>Qty:</span>
                            <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <button className="add-to-cart-cta">ADD TO CART</button>
                    </div>

                    <div className="trust-footer-badges">
                        <div className="trust-item">
                            <div className="t-icon">🚚</div>
                            <div className="t-text">Free Delivery & Installation*</div>
                        </div>
                        <div className="trust-item">
                            <div className="t-icon">🏪</div>
                            <div className="t-text">91+ Experience Stores</div>
                        </div>
                        <div className="trust-item">
                            <div className="t-icon">💳</div>
                            <div className="t-text">Safe & Secure Payment</div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="product-specifications-section">
                <h3>Product Specifications</h3>
                <div className="spec-table">
                    {specifications.map((spec, i) => (
                        <div key={i} className="spec-row">
                            <span className="spec-label">{spec.label}</span>
                            <span className="spec-value">: {spec.value}</span>
                        </div>
                    ))}
                </div>
                <div className="more-info-link">More Information ⌄</div>
            </section>

            <section className="product-tabs-section">
                <h3>PRODUCT INFORMATION</h3>
                <div className="tabs-strip">
                    {['Specifications', 'Care Instructions', 'Terms And Conditions', 'Warranty', 'Merchant Details', 'Disclaimer', 'Delivery & Installation'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="tab-body">
                    <div className="spec-table full">
                        {specifications.map((spec, i) => (
                            <div key={i} className="spec-row">
                                <span className="spec-label">{spec.label}</span>
                                <span className="spec-value">: {spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="customer-reviews-section">
                <h3>Customer Reviews</h3>
                <p>Share your thoughts with other customers</p>
                <button className="write-review-btn">Write a Review</button>
            </section>

            <section className="similar-products-section">
                <h3>Visually Similar Curtains</h3>
                <div className="similar-grid">
                    {similarProducts.map(p => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            </section>

            <section className="faq-section">
                <h3>FREQUENTLY ASKED QUESTIONS</h3>
                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className="faq-item">
                            <div className="faq-q">
                                <span>{faq.q}</span>
                                <span className="plus">+</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
