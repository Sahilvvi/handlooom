import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

// All real local images in /public
const allLocalImages = ['/s1.png', '/s2.png', '/d1.png', '/d2.png', '/f1.png', '/f2.png', '/g1.png', '/g2.png', '/h1.png', '/h2.png', '/q1.png', '/q2.png', '/q3.png'];

// Deterministic hash so same product always shows same image pair
const getCardImages = (seed = '') => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) % allLocalImages.length;
    }
    return {
        primary: allLocalImages[hash % allLocalImages.length],
        secondary: allLocalImages[(hash + 1) % allLocalImages.length]
    };
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const seed = product._id || product.name || '';
    const { primary, secondary } = getCardImages(seed);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <Link to={`/product/${product._id}`} className="product-card fade-in">
            <div className="product-badge-container">
                {product.isBestSeller && <span className="badge-best">Best Seller</span>}
            </div>
            <div className="product-image-wrapper">
                <img src={primary} alt={product.name} className="primary-img" />
                <img src={secondary} alt={product.name} className="secondary-img" />
                <div className="product-actions">
                    <button className="action-btn" title="Add to Wishlist" onClick={(e) => e.preventDefault()}>
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
