import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import BASE_URL, { getImgUrl } from '../../utils/api';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
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
        <Link to={`/product/${product._id}`} className={`product-card-premium ${viewMode === 'list' ? 'list-view' : ''}`}>
            <div className="card-media">
                <div className="badge-stack">
                    {product.isBestSeller && <span className="premium-badge master">Bestseller</span>}
                    {discount && <span className="premium-badge discount">-{discount}% Off</span>}
                </div>
                
                <div className="image-container">
                    <img
                        src={primary}
                        alt={product.name}
                        className="img-primary"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/d1.png'; }}
                    />
                    <img
                        src={secondary}
                        alt={product.name}
                        className="img-secondary"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/d1.png'; }}
                    />
                </div>

                <div className="card-actions-hover">
                    <button className="quick-action-btn" onClick={handleAddToCart}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <span>Add to Cart</span>
                    </button>
                    <button className="wish-btn-small" onClick={handleWishlist}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                </div>
            </div>

            <div className="card-content">
                <span className="artisanal-tag">{product.material || product.category}</span>
                <h3 className="design-name">{product.name}</h3>
                <div className="price-stack">
                    <span className="price-main">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <span className="price-old">₹{product.originalPrice}</span>
                    )}
                </div>
                {product.colors && product.colors.length > 0 && (
                    <div className="color-variants-minimal">
                        {product.colors.slice(0, 4).map((c, i) => (
                            <span key={i} className="variant-dot" style={{ backgroundColor: c }}></span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
