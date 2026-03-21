import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import BASE_URL, { getImgUrl } from '../utils/api';
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
    const [wishlisted, setWishlisted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [size, setSize] = useState('');
    const [addedMsg, setAddedMsg] = useState('');

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
                    fetch(`${BASE_URL}/api/products/${id}`),
                    fetch(`${BASE_URL}/api/products`)
                ]);
                const productData = await productRes.json();
                const allData = await allRes.json();

                // Check if productData is actually a product (has an _id)
                if (productData && productData._id) {
                    // Use real images if they exist, else fallback to mock ones
                    if (!productData.images || productData.images.length === 0) {
                        productData.images = getLocalImages(productData._id || productData.name || id);
                    } else {
                        // Ensure images are corrected with getImgUrl
                        productData.images = productData.images.map(img => getImgUrl(img));
                    }
                    setProduct(productData);

                    if (Array.isArray(allData)) {
                        const similar = allData
                            .filter(p => p.isActive !== false)
                            .filter(p => p.category && productData.category && p.category === productData.category && p._id !== id);
                        setSimilarProducts(similar.slice(0, 4));
                    }
                } else {
                    setProduct(null);
                }

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
        addToCart(product, parseInt(quantity), size);
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

            <div className="boutique-product-grid">
                {/* 1. Left: Image Showcase */}
                <div className="boutique-gallery">
                    <div className="boutique-main-image">
                        <img src={productImages[mainImage]} alt={product.name} />
                        <div className="image-overlay-actions">
                            <button className="icon-circle" onClick={handleShare}>🔗</button>
                            <button className={`icon-circle ${wishlisted ? 'active' : ''}`} onClick={handleWishlist}>
                                {wishlisted ? '❤️' : '🤍'}
                            </button>
                        </div>
                    </div>
                    <div className="boutique-thumbnails">
                        {productImages.map((img, i) => (
                            <div
                                key={i}
                                className={`boutique-thumb ${mainImage === i ? 'active' : ''}`}
                                onMouseEnter={() => setMainImage(i)}
                            >
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Right: Content & Purchase */}
                <div className="boutique-details">
                    <div className="boutique-header">
                        <span className="category-tag">{product.category} Exclusive</span>
                        <h1 className="boutique-title">{product.name}</h1>
                        <div className="boutique-rating">
                            <span className="stars-elegant">★★★★★</span>
                            <span className="review-count">(124 verified reviews)</span>
                        </div>
                    </div>

                    <div className="boutique-price-row">
                        <span className="boutique-price">₹{currentPrice.toLocaleString('en-IN')}</span>
                        {originalPrice > currentPrice && (
                            <>
                                <span className="boutique-mrp">₹{originalPrice.toLocaleString('en-IN')}</span>
                                <span className="boutique-discount">SAVE {discount}%</span>
                            </>
                        )}
                    </div>

                    <p className="boutique-description">
                        Elevate your living space with the {product.name}. A masterpiece of {product.material || 'Premium Fabric'},
                        designed to bring both elegance and functional light control to your home.
                    </p>

                    <div className="boutique-selection">
                        <div className="selection-item">
                            <label>Selection:</label>
                            <span className="selection-value">Set of 2 Panels (7ft)</span>
                        </div>
                        <div className="selection-item">
                            <label>Quantity:</label>
                            <div className="qty-stepper">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
                            </div>
                        </div>

                        <div className="selection-item-column">
                            <label>Curtain Size / Customization:</label>
                            <textarea
                                placeholder="e.g. 5ft x 7ft or Width 48 inches..."
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="boutique-size-textarea"
                            />
                            <p className="size-hint">Mention your specific measurements for a perfect fit.</p>
                        </div>
                    </div>

                    <div className="boutique-actions">
                        <button className="btn-premium add-to-bag" onClick={handleAddToCart}>
                            ADD TO BAG
                        </button>
                        <button className="btn-outline buy-now-boutique">
                            BUY IT NOW
                        </button>
                    </div>

                    {addedMsg && <div className="boutique-toast">{addedMsg}</div>}

                    <div className="boutique-highlights">
                        <div className="highlight-box">
                            <span className="h-icon">✨</span>
                            <div className="h-text">
                                <strong>Premium Quality</strong>
                                <p>Hand-picked fabrics for a luxury feel</p>
                            </div>
                        </div>
                        <div className="highlight-box">
                            <span className="h-icon">🚚</span>
                            <div className="h-text">
                                <strong>Complimentary Shipping</strong>
                                <p>Free delivery on all premium orders</p>
                            </div>
                        </div>
                    </div>

                    <div className="boutique-pincode">
                        <label>CHECK DELIVERY</label>
                        <div className="pincode-wrap">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <button onClick={handlePincodeCheck}>CHECK</button>
                        </div>
                        {pincodeMsg && <p className="pincode-feedback">{pincodeMsg}</p>}
                    </div>
                </div>
            </div>

            <section className="boutique-section card-vibe">
                <div className="boutique-section-header">
                    <h3>The Collection Details</h3>
                </div>
                <div className="spec-grid-boutique">
                    {specifications.map((spec, i) => (
                        <div key={i} className="spec-item-boutique">
                            <span className="spec-label-boutique">{spec.label}</span>
                            <span className="spec-value-boutique">{spec.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="boutique-section card-vibe">
                <div className="boutique-tabs-container">
                    <div className="boutique-tabs-nav">
                        {Object.keys(tabContent).map(tab => (
                            <button
                                key={tab}
                                className={`boutique-tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="boutique-tab-content">
                        {tabContent[activeTab]}
                    </div>
                </div>
            </section>

            <section className="boutique-section card-vibe">
                <div className="boutique-reviews-layout">
                    <div className="boutique-reviews-sidebar">
                        <h3 className="boutique-section-title">Client Reviews</h3>
                        <div className="boutique-rating-summary">
                            <div className="giant-rating-boutique">4.8</div>
                            <div className="boutique-stars">★★★★★</div>
                            <p className="rating-desc-boutique">Based on over 1.2k experiences</p>
                        </div>
                        <button className="btn-outline write-btn-boutique">SUBMIT A REVIEW</button>
                    </div>
                    <div className="boutique-reviews-list">
                        <h4 className="list-title-boutique">Top Stories</h4>
                        <div className="review-card-boutique">
                            <div className="reviewer-info">
                                <span className="reviewer-name">ADITI K.</span>
                                <span className="reviewer-verified">VERIFIED PATRON</span>
                            </div>
                            <div className="review-header-boutique">
                                <span className="review-stars-boutique">★★★★★</span>
                                <span className="review-headline-boutique">EXQUISITE QUALITY</span>
                            </div>
                            <p className="review-body-boutique">The craftsmanship is evident in every thread. These curtains have truly transformed my master bedroom into a sanctuary.</p>
                            <span className="review-date-boutique">MARCH 2026</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="boutique-similar-section">
                <h3>CURATED FOR YOU</h3>
                {similarProducts.length > 0 ? (
                    <div className="similar-grid">{similarProducts.map(p => <ProductCard key={p._id} product={p} />)}</div>
                ) : (
                    <div className="empty-msg">
                        <p>Explore our full collection to find more exquisite curtains like this one.</p>
                        <Link to="/shop" className="btn-outline" style={{ marginTop: '20px', display: 'inline-block', padding: '12px 30px' }}>
                            BROWSE ALL DESIGNS →
                        </Link>
                    </div>
                )}
            </section>

            <section className="boutique-section card-vibe">
                <h3 className="boutique-section-title text-center">FREQUENT INQUIRIES</h3>
                <div className="boutique-faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className="boutique-faq-item">
                            <div className="boutique-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <span>{faq.q}</span>
                                <span className="plus">{openFaq === i ? '−' : '+'}</span>
                            </div>
                            {openFaq === i && <div className="boutique-faq-a">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
