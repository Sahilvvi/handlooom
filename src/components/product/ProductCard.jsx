import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

// Fallback images if no DB images
const FALLBACK = ['/s1.png', '/s2.png', '/d1.png', '/d2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png'];
const getHash = (seed = '') => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % FALLBACK.length;
    return h;
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    // Use actual DB images if available, else fallback to local
    const dbImages = product.images?.filter(Boolean) || [];
    const h = getHash(product._id || product.name);
    const primary = dbImages[0] || FALLBACK[h % FALLBACK.length];
    const secondary = dbImages[1] || FALLBACK[(h + 1) % FALLBACK.length];

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : null;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wishlist = JSON.parse(localStorage.getItem('jannat_wishlist') || '[]');
        const idx = wishlist.indexOf(product._id);
        if (idx === -1) {
            wishlist.push(product._id);
        } else {
            wishlist.splice(idx, 1);
        }
        localStorage.setItem('jannat_wishlist', JSON.stringify(wishlist));
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card fade-in">
            <div className="product-badge-container">
                {product.isBestSeller && <span className="badge-best">Best Seller</span>}
                {discount && <span className="badge-discount">-{discount}%</span>}
                {product.fastDelivery && <span className="badge-fast">⚡ Fast</span>}
            </div>
            <div className="product-image-wrapper">
                <img
                    src={primary}
                    alt={product.name}
                    className="primary-img"
                    onError={e => { e.target.src = FALLBACK[h % FALLBACK.length]; }}
                />
                <img
                    src={secondary}
                    alt={product.name}
                    className="secondary-img"
                    onError={e => { e.target.src = FALLBACK[(h + 1) % FALLBACK.length]; }}
                />
                <div className="product-actions">
                    <button className="action-btn" title="Add to Wishlist" onClick={handleWishlist}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                </div>
                <button className="add-to-cart-overlay" onClick={handleAddToCart}>Add to Cart</button>
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                    <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
                    {product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                    )}
                </div>
                <div className="product-colors">
                    {(product.colors || []).map((color, i) => (
                        <span key={i} className="color-dot" title={color}></span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
