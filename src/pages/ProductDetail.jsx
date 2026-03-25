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
    const [activeTab, setActiveTab] = useState('Composition');
    const [size, setSize] = useState('');
    const [pincode, setPincode] = useState('');
    const [msg, setMsg] = useState('');
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                
                const allRes = await fetch(`${BASE_URL}/api/products`);
                const allData = await allRes.json();
                setSimilar(allData.filter(p => p.category === data.category && p._id !== id).slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity, size);
        setMsg('✨ Added to your curated selection');
        setTimeout(() => setMsg(''), 3000);
    };

    if (loading) return <div className="loading-ux container">Refining Collection...</div>;
    if (!product) return <div className="container" style={{ padding: '150px 0', text-align: 'center' }}>Curated piece not found.</div>;

    const images = product.images && product.images.length > 0 ? product.images.map(img => getImgUrl(img)) : ['https://via.placeholder.com/800x1000'];

    const tabs = {
        'Composition': (
            <div className="tab-pane-ux">
                <p><strong>Handcrafted Excellence:</strong> Each drape is an artisanal masterpiece, woven with the finest {product.material || 'Luxe Fabric'} to ensure cinematic light control and acoustic warmth.</p>
                <div style={{ marginTop: '2.5rem' }}>
                    <p><strong>Composition:</strong> {product.fabric || 'Premium Textile Blend'}</p>
                    <p><strong>Density:</strong> {product.weight || '350 GSM - High Performance'}</p>
                    <p><strong>Sheer Factor:</strong> {product.transparency || 'Semi-Blackout'}</p>
                </div>
            </div>
        ),
        'Care Guild': (
            <div className="tab-pane-ux">
                <p>To preserve the artisanal vibrations of your drapes, we recommend a professional wash every 6 months. For routine maintenance, a gentle cold cycle with PH-balanced detergent is ideal.</p>
                <ul style={{ marginTop: '1.5rem', listStyle: 'none' }}>
                    <li>◌ Do Not Bleach</li>
                    <li>◌ Iron on Low Silhouette Setting</li>
                    <li>◌ Dry away from direct solstice light</li>
                </ul>
            </div>
        ),
        'Shipping & Heritage': (
            <div className="tab-pane-ux">
                <p>Your curated selection is safely packed in recycled luxury boxes. We ship globally with tracked artisanal couriers. Each piece includes a 1-year guarantee of craftsmanship.</p>
            </div>
        )
    };

    return (
        <div className="product-detail-page container">
            <span className="breadcrumb-ux">Home / Shop / {product.category} / {product.name}</span>

            <div className="product-flagship-grid">
                {/* 1. Cinematic Gallery */}
                <div className="flagship-gallery">
                    <div className="thumb-strip">
                        {images.map((img, i) => (
                            <div key={i} className={`thumb-item ${mainImage === i ? 'active' : ''}`} onClick={() => setMainImage(i)}>
                                <img src={img} alt="" />
                            </div>
                        ))}
                    </div>
                    <div className="main-stage-ux">
                        <img src={images[mainImage]} alt={product.name} />
                    </div>
                </div>

                {/* 2. Boutique Info Pane */}
                <aside className="info-pane-ux">
                    <div className="flagship-header">
                        <span className="flagship-tag">{product.category} Masterpiece</span>
                        <h1 className="flagship-title">{product.name}</h1>
                        <div className="flagship-price">
                            ₹{product.price.toLocaleString('en-IN')}
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="old-price-ux">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                    <span className="discount-pill">INVESTMENT SAVING {Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}%</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flagship-selection-ux">
                        <div className="select-group-lux">
                            <label>Curtain Dimensions</label>
                            <select value={size} onChange={(e) => setSize(e.target.value)}>
                                <option value="">Select Curated Size</option>
                                <option value="5ft">Standard Window (5ft)</option>
                                <option value="7ft">Luxury Door (7ft)</option>
                                <option value="9ft">Full Length (9ft)</option>
                                <option value="Custom">Bespoke Fitting</option>
                            </select>
                        </div>

                        <div className="select-group-lux">
                            <label>Quantity</label>
                            <div className="qty-control-lux">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        <div className="flagship-actions">
                            <button className="btn-lux" onClick={handleAddToCart}>ADD TO CURATION</button>
                            <Link to="/checkout" className="btn-lux-outline" style={{ textAlign: 'center' }}>IMMEDIATE PURCHASE</Link>
                        </div>
                        {msg && <div style={{ marginTop: '20px', color: 'var(--lux-gold)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>{msg}</div>}
                    </div>

                    <div className="pincode-purity">
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>Delivery Check</label>
                        <div style={{ display: 'flex', border: '1px solid #eee' }}>
                            <input type="text" placeholder="Enter Pincode" style={{ border: 'none', flex: 1 }} />
                            <button style={{ background: 'none', border: 'none', fontWeight: 800, padding: '15px' }}>CHECK</button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* 3. Detailed Heritage Tabs */}
            <section className="detail-extra-section">
                <div className="tab-nav-lux">
                    {Object.keys(tabs).map(tab => (
                        <button key={tab} className={`tab-btn-lux ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                    ))}
                </div>
                <div className="tab-content-lux">
                    {tabs[activeTab]}
                </div>
            </section>

            {/* 4. Curated Pairings */}
            <section style={{ marginTop: '140px' }}>
                <span className="section-subtitle">Aesthetic Harmony</span>
                <h2 className="title-luxury" style={{ textAlign: 'center' }}>Artisanal Complementaries</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px', marginTop: '60px' }}>
                    {similar.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
