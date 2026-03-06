import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '', category: CATEGORIES[0], price: '', originalPrice: '', fabric: '',
        material: 'Cotton', transparency: 'Semi-Sheer', description: '',
        room: 'Living Room', stock: 50, colors: '', sizes: '',
        isBestSeller: false, fastDelivery: false, isActive: true
    });
    const [images, setImages] = useState([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);

    useEffect(() => {
        fetch(`${BASE_URL}/api/products/${id}`)
            .then(r => r.json())
            .then(data => {
                setFormData({
                    name: data.name || '',
                    category: data.category || CATEGORIES[0],
                    price: data.price || '',
                    originalPrice: data.originalPrice || '',
                    fabric: data.fabric || '',
                    material: data.material || 'Cotton',
                    transparency: data.transparency || 'Semi-Sheer',
                    description: data.description || '',
                    room: data.room || 'Living Room',
                    stock: data.stock || 0,
                    colors: (data.colors || []).join(', '),
                    sizes: (data.sizes || []).join(', '),
                    isBestSeller: data.isBestSeller || false,
                    fastDelivery: data.fastDelivery || false,
                    isActive: data.isActive !== undefined ? data.isActive : true
                });
                setImages(data.images || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        setError('');
        const token = localStorage.getItem('jannat_token');

        const newImages = [];
        let hasError = false;

        for (const file of files) {
            try {
                const uploadData = new FormData();
                uploadData.append('image', file); // Single upload

                const res = await fetch(`${BASE_URL}/api/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: uploadData
                });

                const data = await res.json();
                if (res.ok) {
                    newImages.push(data.url);
                } else {
                    hasError = true;
                    setError(data.message || 'One or more images failed');
                }
            } catch (err) {
                hasError = true;
                setError('Upload error');
            }
        }

        if (newImages.length > 0) {
            setImages(prev => [...prev, ...newImages]);
        }
        setUploading(false);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        if (thumbnailIndex === index) setThumbnailIndex(0);
        else if (thumbnailIndex > index) setThumbnailIndex(thumbnailIndex - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!images.length) return setError('Please upload at least one image');

        setSaving(true);
        setError('');

        // Prepare image array (thumbnail at index 0)
        let finalImages = [...images];
        if (thumbnailIndex > 0 && thumbnailIndex < finalImages.length) {
            const thumb = finalImages.splice(thumbnailIndex, 1)[0];
            finalImages.unshift(thumb);
        }

        try {
            const token = localStorage.getItem('jannat_token');
            const productData = {
                ...formData,
                colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: Number(formData.stock),
                images: finalImages
            };

            const response = await fetch(`${BASE_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(productData)
            });
            if (response.ok) navigate('/admin/products');
            else setError('Failed to update product');
        } catch (err) {
            console.error(err);
            setError('Connection error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading product details...</div>;

    return (
        <div className="add-product-container">
            <h2 className="form-title">Edit Product</h2>
            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
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
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Original / MRP (₹)</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="e.g. 3799" />
                    </div>
                </div>

                {/* Images Upload */}
                <div className="form-group">
                    <label>Product Images * (Click to set main thumbnail)</label>
                    <div className="image-upload-section">
                        <div className="upload-controls">
                            <label className="file-input-label">
                                📤 Add More Images
                                <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {uploading && <span className="upload-status">Uploading...</span>}
                        </div>

                        <div className="images-grid">
                            {images.map((img, idx) => (
                                <div key={idx} className={`image-preview-item ${idx === thumbnailIndex ? 'is-thumbnail' : ''}`} onClick={() => setThumbnailIndex(idx)}>
                                    <img src={(img.startsWith('http') || img.startsWith('data:')) ? img : `${BASE_URL}${img}`} alt="" />
                                    <button type="button" className="remove-img" onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>&times;</button>
                                    {idx === thumbnailIndex && <div className="thumbnail-badge">Main Thumbnail</div>}
                                </div>
                            ))}
                        </div>
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
                        <label>Colors (comma separated)</label>
                        <input name="colors" value={formData.colors} onChange={handleChange} placeholder="Ivory, Blue, Beige" />
                    </div>
                    <div className="form-group">
                        <label>Sizes (comma separated)</label>
                        <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="5ft, 7ft, 9ft" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Fabric Details</label>
                        <input name="fabric" value={formData.fabric} onChange={handleChange} placeholder="100% Pure Cotton" />
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
                        <label>Stock Quantity</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
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
                    <button type="submit" className="btn-primary" disabled={saving || uploading}>
                        {saving ? 'Updating...' : '✅ Update Product'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
