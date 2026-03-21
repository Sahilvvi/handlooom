import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    // Use standardized helper
    const dbImages = product.images?.filter(Boolean) || [];
    const primary = getImgUrl(dbImages[0]);
    const secondary = getImgUrl(dbImages[1] || dbImages[0]);

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
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/d1.png'; }}
                />
                <img
                    src={secondary}
                    alt={product.name}
                    className="secondary-img"
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/d1.png'; }}
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
                    <span className="current-price">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice}</span>
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
