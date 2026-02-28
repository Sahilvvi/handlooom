import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
                if (data.sizes) setSelectedSize(data.sizes[0]);
                if (data.colors) setSelectedColor(data.colors[0]);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading-container container">Extracting fabric details...</div>;
    if (!product) return <div className="container">Product not found.</div>;

    return (
        <div className="product-detail-page container">
            <div className="breadcrumb">
                <a href="/">Home</a> / <a href="/shop">Shop</a> / <span>{product.name}</span>
            </div>

            <div className="product-main-view">
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={product.images[0]} alt={product.name} />
                    </div>
                    <div className="thumbnail-list">
                        {product.images.map((img, i) => (
                            <div key={i} className="thumb-item">
                                <img src={img} alt={`${product.name} thumb ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-info-panel">
                    <span className="product-category-label">{product.category}</span>
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-price-large">₹{product.price.toLocaleString('en-IN')}</div>

                    <div className="product-selection">
                        <div className="selection-group">
                            <label>Select Size</label>
                            <div className="size-options">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <label>Select Color</label>
                            <div className="color-options">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        className={`color-dot-btn ${selectedColor === color ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                        title={color}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        <div className="selection-group">
                            <label>Quantity</label>
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="product-cta-buttons">
                        <button className="btn-primary add-to-cart-btn">Add to Cart</button>
                        <button className="btn-outline wishlist-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                    </div>

                    <div className="product-trust-badges">
                        <div className="badge-item">
                            <span>🚚</span>
                            <p>Free Shipping</p>
                        </div>
                        <div className="badge-item">
                            <span>🔄</span>
                            <p>Easy 30-Day Returns</p>
                        </div>
                        <div className="badge-item">
                            <span>🛡️</span>
                            <p>Secure Payment</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-tabs">
                <div className="tab-headers">
                    <button className={activeTab === 'description' ? 'visible' : ''} onClick={() => setActiveTab('description')}>Description</button>
                    <button className={activeTab === 'details' ? 'visible' : ''} onClick={() => setActiveTab('details')}>Fabric & Care</button>
                    <button className={activeTab === 'shipping' ? 'visible' : ''} onClick={() => setActiveTab('shipping')}>Shipping</button>
                </div>
                <div className="tab-content">
                    {activeTab === 'description' && (
                        <div className="tab-pane fade-in">
                            <p>{product.description}</p>
                            <p>The {product.name} is a testament to the rich handloom heritage of India, redesigned for the modern aesthetic. Each piece is crafted with meticulous attention to detail, ensuring a premium finish that elevates your home's ambiance.</p>
                        </div>
                    )}
                    {activeTab === 'details' && (
                        <div className="tab-pane fade-in">
                            <ul>
                                <li><strong>Fabric:</strong> {product.fabric}</li>
                                <li><strong>Weight:</strong> Heavy-duty, high-density weave</li>
                                <li><strong>Light Control:</strong> {product.category === 'Blackout' ? '95-100% Light Block' : 'Light Filtering'}</li>
                                <li><strong>Care:</strong> Dry clean recommended. Cold machine wash on gentle cycle for certain variants.</li>
                                <li><strong>Ironing:</strong> Low heat steam iron on reverse side.</li>
                            </ul>
                        </div>
                    )}
                    {activeTab === 'shipping' && (
                        <div className="tab-pane fade-in">
                            <p>We offer free standard shipping on all orders above ₹999 within India.</p>
                            <p><strong>Delivery Estimate:</strong> 5-7 business days depending on your location.</p>
                            <p>Cash on Delivery (COD) is available for most pincodes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
