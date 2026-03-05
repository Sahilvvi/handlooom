import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../utils/api';
import './AddProduct.css';

const CATEGORIES = [
    'Long Crush', 'Heavy Nitin Print', 'Heavy Long Crush', 'Zekat All over', 'Zekat Pech',
    'Blackout Foil', 'Blackout Embossed', 'Blackout Plain', 'Net', 'Tissues', 'Velvet',
    'Long Crush Embossed', 'Digital Print', 'Blind', 'All size', 'All fitting'
];
const ROOMS = ['Living Room', 'Bedroom', 'Dining Area', 'Kids Room', 'Office'];
const TRANSPARENCIES = ['Sheer', 'Semi-Sheer', 'Opaque', 'Blackout'];
const MATERIALS = ['Cotton', 'Polyester', 'Linen', 'Velvet', 'Silk Blend', 'Jute', 'Organza'];

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '', category: CATEGORIES[0], price: '', originalPrice: '', fabric: '',
        material: 'Cotton', transparency: 'Semi-Sheer', description: '',
        room: 'Living Room', isBestSeller: false, fastDelivery: false, stock: 50,
        sizes: '', colors: '', isActive: true
    });
    const [images, setImages] = useState([]); // Array of strings (URLs)
    const [thumbnailIndex, setThumbnailIndex] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        setError('');
        const token = localStorage.getItem('jannat_token');
        const uploadData = new FormData();
        files.forEach(f => uploadData.append('images', f));

        try {
            const res = await fetch(`${BASE_URL}/api/upload/multiple`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });
            const data = await res.json();
            if (res.ok) {
                setImages([...images, ...data.urls.map(u => u.url)]);
            } else {
                setError(data.message || 'Upload failed');
            }
        } catch {
            setError('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        if (thumbnailIndex === index) setThumbnailIndex(0);
        else if (thumbnailIndex > index) setThumbnailIndex(thumbnailIndex - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!images.length) return setError('Please upload at least one image');

        setLoading(true);
        setError('');

        // Prepare image array (thumbnail at index 0)
        let finalImages = [...images];
        if (thumbnailIndex > 0) {
            const thumb = finalImages.splice(thumbnailIndex, 1)[0];
            finalImages.unshift(thumb);
        }

        try {
            const token = localStorage.getItem('jannat_token');
            const productData = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: Number(formData.stock),
                images: finalImages,
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
                colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean)
            };

            const response = await fetch(`${BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(productData)
            });

            if (response.ok) navigate('/admin/products');
            else {
                const data = await response.json();
                setError(data.message || 'Failed to create product');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2 className="form-title">Add New Product</h2>
            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Noor Linen Sheer Curtain" />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Selling Price (₹) *</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 1899" min="1" />
                    </div>
                    <div className="form-group">
                        <label>Original / MRP (₹)</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="e.g. 3799" />
                    </div>
                </div>

                {/* Images Upload */}
                <div className="form-group">
                    <label>Product Images * (First one is thumbnail)</label>
                    <div className="image-upload-section">
                        <div className="upload-controls">
                            <label className="file-input-label">
                                📤 Upload Images
                                <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {uploading && <span className="upload-status">Uploading...</span>}
                        </div>

                        <div className="images-grid">
                            {images.map((img, idx) => (
                                <div key={idx} className={`image-preview-item ${idx === thumbnailIndex ? 'is-thumbnail' : ''}`} onClick={() => setThumbnailIndex(idx)}>
                                    <img src={img} alt="" />
                                    <button type="button" className="remove-img" onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>&times;</button>
                                    {idx === thumbnailIndex && <div className="thumbnail-badge">Main Thumbnail</div>}
                                </div>
                            ))}
                        </div>
                        <p className="image-help-text">Click an image to set it as <strong>main thumbnail</strong>. You can upload multiple files.</p>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Material</label>
                        <select name="material" value={formData.material} onChange={handleChange}>
                            {MATERIALS.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Transparency</label>
                        <select name="transparency" value={formData.transparency} onChange={handleChange}>
                            {TRANSPARENCIES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Fabric Details</label>
                        <input name="fabric" value={formData.fabric} onChange={handleChange} required placeholder="e.g. 100% Pure Cotton" />
                    </div>
                    <div className="form-group">
                        <label>Room Type</label>
                        <select name="room" value={formData.room} onChange={handleChange}>
                            {ROOMS.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Sizes (comma-separated)</label>
                        <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="5ft, 7ft, 9ft" />
                    </div>
                    <div className="form-group">
                        <label>Colors (comma-separated)</label>
                        <input name="colors" value={formData.colors} onChange={handleChange} placeholder="Ivory, White, Beige" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <div className="checkboxes-row" style={{ display: 'grid' }}>
                            <label className="checkbox-label" style={{ padding: '8px 12px' }}>
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                <span>{formData.isActive ? '✅ Available' : '🚫 Out of Stock'}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required></textarea>
                </div>

                <div className="form-row checkboxes-row">
                    <label className="checkbox-label">
                        <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} />
                        <span>⭐ Best Seller</span>
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name="fastDelivery" checked={formData.fastDelivery} onChange={handleChange} />
                        <span>⚡ Fast Delivery</span>
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading || uploading}>
                        {loading ? 'Saving...' : '✅ Save Product'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};
export default AddProduct;
