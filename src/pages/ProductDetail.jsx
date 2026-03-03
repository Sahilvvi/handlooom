import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Specifications');
    const [pincode, setPincode] = useState('');
    const [pincodeMsg, setPincodeMsg] = useState('');
    const [similarProducts, setSimilarProducts] = useState([]);
    const [addedMsg, setAddedMsg] = useState('');
    const [wishlisted, setWishlisted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    // All real local images available in /public folder
    const allLocalImages = ['/s1.png', '/s2.png', '/d1.png', '/d2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png', '/h1.png', '/h2.png', '/q1.png', '/q2.png', '/q3.png'];

    const getLocalImages = (seed = '') => {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash * 31 + seed.charCodeAt(i)) % allLocalImages.length;
        }
        const imgs = [];
        for (let i = 0; i < 5; i++) {
            imgs.push(allLocalImages[(hash + i) % allLocalImages.length]);
        }
        return imgs;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, allRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/products/${id}`),
                    fetch(`http://localhost:5000/api/products`)
                ]);
                const productData = await productRes.json();
                const allData = await allRes.json();

                if (productData) {
                    productData.images = getLocalImages(productData._id || productData.name || id);
                }

                setProduct(productData);
                const similar = (allData || []).filter(p => p.category && productData.category && p.category === productData.category && p._id !== id);
                setSimilarProducts(similar.slice(0, 4));
                setLoading(false);

                // Check wishlist state
                const wishlist = JSON.parse(localStorage.getItem('jannat_wishlist') || '[]');
                setWishlisted(wishlist.includes(id));
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, parseInt(quantity));
        setAddedMsg('✅ Added to cart!');
        setTimeout(() => setAddedMsg(''), 2500);
    };

    const handleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('jannat_wishlist') || '[]');
        let updated;
        if (wishlisted) {
            updated = wishlist.filter(wid => wid !== id);
        } else {
            updated = [...wishlist, id];
        }
        localStorage.setItem('jannat_wishlist', JSON.stringify(updated));
        setWishlisted(!wishlisted);
    };

    const handlePincodeCheck = () => {
        if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
            setPincodeMsg('❌ Please enter a valid 6-digit pincode.');
            return;
        }
        setPincodeMsg('✅ Yay! Delivery available in 5-7 business days. Free shipping on orders above ₹999.');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: product?.name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) return <div className="loading-container container">Loading Product Details...</div>;
    if (!product) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Product not found. <Link to="/shop">Back to Shop</Link></div>;

    const currentPrice = product.price || 840;
    const originalPrice = product.originalPrice || currentPrice * 2;
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    const offers = [
        { title: 'Store Discount', desc: 'Get Instant Extra Discount* Experience this product in-store and enjoy special additional savings.', link: 'BOOK A VISIT' },
        { title: '5% Instant Discount', desc: 'on HDFC Bank Credit & Debit Card EMI', icon: '🏦' },
        { title: 'Easy EMI', desc: `Get it for ₹${Math.round(currentPrice / 12)}/month`, icons: ['🏦', '💳'] }
    ];

    const specifications = [
        { label: 'Material', value: product.material || product.fabric || 'Polyester' },
        { label: 'Fabric', value: product.fabric || 'Premium Blend' },
        { label: 'Transparency', value: product.transparency || 'Semi-Sheer' },
        { label: 'Colors Available', value: (product.colors || []).join(', ') || product.color || 'Multiple' },
        { label: 'Sizes Available', value: (product.sizes || []).join(', ') || '5ft, 7ft, 9ft' },
        { label: 'Pack Content', value: '1 Set of 2 Curtain Panels' },
        { label: 'Brand', value: 'Jannat Handloom' },
        { label: 'Room Type', value: product.room || 'All Rooms' },
        { label: 'Dimensions (W × H)', value: '44 W × 60 H inches per panel' },
        { label: 'Stock', value: product.stock > 0 ? `${product.stock} units available` : 'Out of Stock' }
    ];

    const tabContent = {
        'Specifications': <div className="spec-table full">{specifications.map((spec, i) => <div key={i} className="spec-row"><span className="spec-label">{spec.label}</span><span className="spec-value">: {spec.value}</span></div>)}</div>,
        'Care Instructions': (
            <div className="tab-text-content">
                <p>🧺 <strong>Washing:</strong> Machine wash cold on gentle cycle. Do not bleach.</p>
                <p>🚿 <strong>Drying:</strong> Tumble dry on low heat or air dry. Remove promptly to avoid wrinkles.</p>
                <p>🔥 <strong>Ironing:</strong> Iron on low heat. Use a pressing cloth for delicate fabrics.</p>
                <p>🧹 <strong>Dry Cleaning:</strong> Dry cleaning is recommended for Velvet and Silk Blend varieties.</p>
                <p>💧 <strong>Tip:</strong> Hang curtains while slightly damp for best results — gravity helps eliminate wrinkles.</p>
            </div>
        ),
        'Terms And Conditions': (
            <div className="tab-text-content">
                <p>• All products sold by Jannat Handloom are subject to our standard Terms & Conditions.</p>
                <p>• Colors may slightly vary from the images shown due to monitor calibration differences.</p>
                <p>• Dimensions listed are approximate and may have a ± 2% variance in actual product size.</p>
                <p>• Jannat Handloom reserves the right to substitute similar products if listed item is unavailable.</p>
                <p>• Bulk orders (10+ units) are eligible for special pricing. Contact us at help@jannatloom.com.</p>
            </div>
        ),
        'Warranty': (
            <div className="tab-text-content">
                <p>🛡️ <strong>1-Year Warranty</strong> against manufacturing defects.</p>
                <p>• Warranty covers: fabric defects, stitching failures, and color bleeding under normal conditions.</p>
                <p>• Warranty does not cover: physical damage, misuse, normal wear & tear, or negligent care.</p>
                <p>• To claim warranty, email help@jannatloom.com with your order number and photos of the defect.</p>
                <p>• We will arrange a replacement or refund within 7-10 business days of claim approval.</p>
            </div>
        ),
        'Merchant Details': (
            <div className="tab-text-content">
                <p>🏢 <strong>Sold by:</strong> Jannat Handloom India Pvt. Ltd.</p>
                <p>📍 <strong>Address:</strong> Sector 62, Noida, Uttar Pradesh - 201301</p>
                <p>📞 <strong>Phone:</strong> +91 98765 43210 (Mon-Sat, 10 AM - 7 PM)</p>
                <p>📧 <strong>Email:</strong> help@jannatloom.com</p>
                <p>🌐 <strong>Website:</strong> www.jannatloom.com</p>
                <p>📜 <strong>GSTIN:</strong> 09AAAAA0000A1Z5</p>
            </div>
        ),
        'Disclaimer': (
            <div className="tab-text-content">
                <p>• Product images are for representative purposes only. Actual colors may vary slightly.</p>
                <p>• Pricing is subject to change without prior notice. GST and applicable taxes are included in the displayed price.</p>
                <p>• Jannat Handloom is not responsible for any allergic reactions to fabric materials. Please check material details carefully if you have fabric sensitivities.</p>
            </div>
        ),
        'Delivery & Installation': (
            <div className="tab-text-content">
                <p>🚚 <strong>Standard Delivery:</strong> 5-7 business days across India.</p>
                <p>⚡ <strong>Express Delivery:</strong> 2-3 business days available for select pincodes (additional ₹99 charge).</p>
                <p>📦 <strong>Packaging:</strong> Safely packed in a water-resistant polybag inside a sturdy cardboard box.</p>
                <p>🔧 <strong>Installation:</strong> FREE installation assistance available in Mumbai, Delhi, Bangalore, & Hyderabad. Contact us after delivery to schedule.</p>
                <p>🕐 <strong>Order Tracking:</strong> Track your order via the link sent to your email/SMS after dispatch.</p>
            </div>
        )
    };

    const faqs = [
        { q: 'How do I determine the right width and length of my curtain?', a: 'Measure the width of your window and multiply by 1.5x-2x for fullness. For length, measure from the rod to where you want the curtain to end (floor, windowsill, or below sill). Standard sizes: 5ft for windows, 7ft for standard doors, 9ft for tall ceilings.' },
        { q: 'What materials do you offer, and which is best for me?', a: 'We offer Linen (natural, breathable), Cotton (easy wash, durable), Velvet (luxurious, heavy), Polyester (affordable, easy care), and Silk Blend (premium, elegant). For daily use, Cotton or Polyester are ideal. For luxury look, Velvet or Silk Blend.' },
        { q: 'How do I hang these curtains?', a: 'Most of our curtains come with eyelet (ring) tops for easy hanging on standard curtain rods. Simply thread the rod through the eyelets. For pinch pleat curtains, use curtain hooks with compatible tracks.' },
        { q: 'Can I get custom sizes?', a: 'Currently we offer standard sizes (5ft, 7ft, 9ft). Custom sizing is available for bulk orders (10+ panels). Contact help@jannatloom.com with your requirements and we will provide a quote.' },
        { q: 'What is your return policy?', a: 'We offer a 7-day return policy from the date of delivery. Products must be unused, unwashed, and in original packaging with all tags intact. Refunds are processed within 5-7 working days after quality check.' }
    ];

    const productImages = product.images || allLocalImages.slice(0, 5);

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
                            <button className="share-btn" onClick={handleShare} title="Share">🔗</button>
                            <button className={`wish-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist} title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                {wishlisted ? '❤️' : '🤍'}
                            </button>
                        </div>
                    </div>
                    <div className="thumbnail-strip">
                        {productImages.map((img, i) => (
                            <div key={i} className={`thumb-box ${mainImage === i ? 'active' : ''}`} onClick={() => setMainImage(i)}>
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-details-content">
                    <h1 className="product-main-title">{product.name} — Set of 2 ({product.transparency || 'Premium'}, {product.sizes?.[0] || '7ft'})</h1>
                    <div className="review-link">⭐⭐⭐⭐⭐ Write a review</div>

                    <div className="price-box">
                        <div className="current-price-row">
                            <span className="price-val">₹{currentPrice.toLocaleString('en-IN')}</span>
                            <span className="discount-pct">{discount}% Off</span>
                        </div>
                        <div className="mrp-row">MRP <span className="mrp-val">₹{originalPrice.toLocaleString('en-IN')}</span></div>
                        <div style={{ fontSize: '0.82rem', color: '#16a34a', marginTop: '4px' }}>✅ Inclusive of all taxes</div>
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
                                    {offer.link && <a href="/contact">{offer.link}</a>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="delivery-check">
                        <div className="check-header">🚚 Check delivery details</div>
                        <div className="pincode-input-group">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                maxLength={6}
                                onChange={(e) => { setPincode(e.target.value); setPincodeMsg(''); }}
                            />
                            <button className="check-btn" onClick={handlePincodeCheck}>CHECK</button>
                        </div>
                        {pincodeMsg && <p className={`pincode-msg ${pincodeMsg.startsWith('✅') ? 'success' : 'error'}`}>{pincodeMsg}</p>}
                    </div>

                    <div className="cta-row">
                        <div className="qty-select">
                            <span>Qty:</span>
                            <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <button className="add-to-cart-cta" onClick={handleAddToCart}>ADD TO CART</button>
                    </div>
                    {addedMsg && <div className="added-toast">{addedMsg}</div>}

                    <div className="trust-footer-badges">
                        <div className="trust-item"><div className="t-icon">🚚</div><div className="t-text">Free Delivery & Installation*</div></div>
                        <div className="trust-item"><div className="t-icon">🏪</div><div className="t-text">Experience Stores Across India</div></div>
                        <div className="trust-item"><div className="t-icon">💳</div><div className="t-text">Safe & Secure Payment</div></div>
                    </div>
                </div>
            </div>

            <section className="product-specifications-section">
                <h3>Product Specifications</h3>
                <div className="spec-table">
                    {specifications.slice(0, 6).map((spec, i) => (
                        <div key={i} className="spec-row">
                            <span className="spec-label">{spec.label}</span>
                            <span className="spec-value">: {spec.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="product-tabs-section">
                <h3>PRODUCT INFORMATION</h3>
                <div className="tabs-strip">
                    {Object.keys(tabContent).map(tab => (
                        <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                </div>
                <div className="tab-body">{tabContent[activeTab]}</div>
            </section>

            <section className="customer-reviews-section">
                <h3>Customer Reviews</h3>
                <p style={{ color: '#666', marginBottom: '16px' }}>Be the first to share your experience with this product!</p>
                <form className="review-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your review! It will appear after moderation.'); e.target.reset(); }}>
                    <div className="review-rating-row">
                        <label>Your Rating:</label>
                        <div className="star-select">
                            {[1, 2, 3, 4, 5].map(s => <span key={s} className="star-opt">{'★'}</span>)}
                        </div>
                    </div>
                    <input type="text" placeholder="Your Name" required className="review-input" />
                    <textarea placeholder="Write your review here..." required rows="4" className="review-input" style={{ resize: 'vertical' }}></textarea>
                    <button type="submit" className="write-review-btn">Submit Review</button>
                </form>
            </section>

            <section className="similar-products-section">
                <h3>Visually Similar Curtains</h3>
                {similarProducts.length > 0 ? (
                    <div className="similar-grid">{similarProducts.map(p => <ProductCard key={p._id} product={p} />)}</div>
                ) : (
                    <p style={{ color: '#999' }}>Explore our <Link to="/shop" style={{ color: '#ed6c0d' }}>full collection →</Link></p>
                )}
            </section>

            <section className="faq-section">
                <h3>FREQUENTLY ASKED QUESTIONS</h3>
                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className="faq-item">
                            <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <span>{faq.q}</span>
                                <span className="plus">{openFaq === i ? '−' : '+'}</span>
                            </div>
                            {openFaq === i && <div className="faq-a">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
